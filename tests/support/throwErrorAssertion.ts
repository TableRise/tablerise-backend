import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import getErrorName from 'src/domains/common/helpers/getErrorName';

export function throwErrorAssert(
    error: HttpRequestErrors,
    errorMessage: string,
    code: number
): void {
    expect(error.code).to.be.equal(code);
    expect(error.message).to.be.equal(errorMessage);
    expect(error.name).to.be.equal(getErrorName(code));
}
