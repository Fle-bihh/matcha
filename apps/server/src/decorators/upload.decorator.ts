import type { RequestHandler } from "express";
import { ServiceResponse } from "@/types";
import { StatusCodes } from "http-status-codes";

interface FileValidationOptions {
  required?: boolean;
  maxSize?: number; // in bytes
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
}

interface UploadOptions {
  validation?: FileValidationOptions;
}

export function upload(
  uploadMiddleware: RequestHandler,
  options?: UploadOptions
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const req = args[0];
      const res = args[1];
      const next = () => {
        if (options?.validation) {
          const validationError = validateFile(req, options.validation);
          if (validationError) {
            const response = ServiceResponse.failure(
              "File validation failed",
              { details: [{ field: "file", message: validationError }] },
              StatusCodes.BAD_REQUEST
            );
            return res.status(StatusCodes.BAD_REQUEST).json(response);
          }
        }

        return originalMethod.apply(this, args);
      };

      return uploadMiddleware(req, res, next);
    };

    return descriptor;
  };
}

function validateFile(
  req: any,
  validation: FileValidationOptions
): string | null {
  const file = req.file;
  const files = req.files;

  if (
    validation.required &&
    !file &&
    (!files || Object.keys(files).length === 0)
  ) {
    return "File is required";
  }

  if (!file && (!files || Object.keys(files).length === 0)) {
    return null;
  }

  if (file) {
    return validateSingleFile(file, validation);
  }

  if (files) {
    if (Array.isArray(files)) {
      for (const f of files) {
        const error = validateSingleFile(f, validation);
        if (error) return error;
      }
    } else {
      for (const fieldName in files) {
        const fieldFiles = files[fieldName];
        for (const f of fieldFiles) {
          const error = validateSingleFile(f, validation);
          if (error) return error;
        }
      }
    }
  }

  return null;
}

function validateSingleFile(
  file: Express.Multer.File,
  validation: FileValidationOptions
): string | null {
  if (validation.maxSize && file.size > validation.maxSize) {
    const maxSizeMB = (validation.maxSize / (1024 * 1024)).toFixed(2);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return `File size (${fileSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)`;
  }

  if (validation.allowedMimeTypes && validation.allowedMimeTypes.length > 0) {
    if (!validation.allowedMimeTypes.includes(file.mimetype)) {
      return `File type '${
        file.mimetype
      }' is not allowed. Allowed types: ${validation.allowedMimeTypes.join(
        ", "
      )}`;
    }
  }

  if (validation.allowedExtensions && validation.allowedExtensions.length > 0) {
    const ext = file.originalname.split(".").pop()?.toLowerCase();
    if (!ext || !validation.allowedExtensions.includes(ext)) {
      return `File extension '.${ext}' is not allowed. Allowed extensions: ${validation.allowedExtensions.join(
        ", "
      )}`;
    }
  }

  return null;
}
