export class DtoValidationError {
    property: string;
    value: string;
    constraints?: {
        [type: string]: string;
    };
}