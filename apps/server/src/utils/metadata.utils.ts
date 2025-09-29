import "reflect-metadata";
import {
	METADATA_KEYS,
	type RouteMetadata,
	type ApiDocsMetadata,
	type AuthMetadata,
	type ValidateMetadata,
} from "@/constants/metadata.constants";

export class MetadataUtils {
	/**
	 * Récupère les métadonnées de route d'une méthode
	 */
	static getRouteMetadata(
		target: any,
		propertyKey: string
	): RouteMetadata | undefined {
		return Reflect.getMetadata(METADATA_KEYS.ROUTE, target, propertyKey);
	}

	/**
	 * Récupère les métadonnées de documentation d'une méthode
	 */
	static getApiDocsMetadata(
		target: any,
		propertyKey: string
	): ApiDocsMetadata | undefined {
		return Reflect.getMetadata(METADATA_KEYS.API_DOCS, target, propertyKey);
	}

	/**
	 * Récupère les métadonnées d'authentification d'une méthode
	 */
	static getAuthMetadata(
		target: any,
		propertyKey: string
	): AuthMetadata | undefined {
		return Reflect.getMetadata(METADATA_KEYS.AUTH, target, propertyKey);
	}

	/**
	 * Récupère les métadonnées de validation d'une méthode
	 */
	static getValidateMetadata(
		target: any,
		propertyKey: string
	): ValidateMetadata | undefined {
		return Reflect.getMetadata(METADATA_KEYS.VALIDATE, target, propertyKey);
	}

	/**
	 * Vérifie si une méthode a des métadonnées de route
	 */
	static hasRoute(target: any, propertyKey: string): boolean {
		return Reflect.hasMetadata(METADATA_KEYS.ROUTE, target, propertyKey);
	}

	/**
	 * Vérifie si une méthode nécessite une authentification
	 */
	static requiresAuth(target: any, propertyKey: string): boolean {
		const authMetadata = this.getAuthMetadata(target, propertyKey);
		return authMetadata?.required === true;
	}

	/**
	 * Récupère toutes les méthodes d'une classe qui ont des métadonnées de route
	 */
	static getRouteMethods(target: any): string[] {
		const methods: string[] = [];
		const prototype = target.prototype || target;

		// Parcourir toutes les propriétés de la classe
		const propertyNames = Object.getOwnPropertyNames(prototype);

		propertyNames.forEach((propertyName) => {
			if (this.hasRoute(prototype, propertyName)) {
				methods.push(propertyName);
			}
		});

		return methods;
	}

	/**
	 * Récupère toutes les métadonnées d'une méthode
	 */
	static getAllMethodMetadata(target: any, propertyKey: string) {
		return {
			route: this.getRouteMetadata(target, propertyKey),
			apiDocs: this.getApiDocsMetadata(target, propertyKey),
			auth: this.getAuthMetadata(target, propertyKey),
			validate: this.getValidateMetadata(target, propertyKey),
		};
	}
}
