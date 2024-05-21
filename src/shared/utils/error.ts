export const logBackendError = (
  error: any,
  errorDescription = '',
  alertUser = false,
  fallbackAlertMessage = '',
) => {
  console.error(`${errorDescription}: ${error?.response?.data?.exc_code ?? error}`);
  if (error?.response?.data?.message) {
    console.error(`${errorDescription}: ${error?.response?.data?.message}`);
  }
  if (alertUser) {
    alert(error?.response?.data?.message ?? fallbackAlertMessage);
  }
};
