// export const readNotificationByReferenceHandler = async (
//   reference: string,
//   accessToken: string,
// ) => {
//   try {
//     const response = await axiosInstance.patch(
//       `/v1/notifications/${reference}/read`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       },
//     );
//     return response.data.data;
//   } catch (err) {
//     throw err;
//   }
// };
