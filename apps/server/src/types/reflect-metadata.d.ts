import "reflect-metadata";

declare global {
	namespace Reflect {
		function defineMetadata(
			metadataKey: any,
			metadataValue: any,
			target: any,
			propertyKey?: string | symbol
		): void;
		function getMetadata(
			metadataKey: any,
			target: any,
			propertyKey?: string | symbol
		): any;
		function hasMetadata(
			metadataKey: any,
			target: any,
			propertyKey?: string | symbol
		): boolean;
	}
}
