import ClientV1, { ApiError } from "api/clientv1";

const Client = new ClientV1();
const DEFAULT_SERVER_ERROR_MESSAGE = "Something went wrong, please try again.";

export { Client, ApiError, DEFAULT_SERVER_ERROR_MESSAGE };
