/**
 * Adds the token object to the express request param
 */
declare namespace Express {
    interface Request {
        token?: string;
    }
}