import { apiSlice } from "@/redux/api/apiSlice";

export const contactApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //post message
    sendContactMessage: builder.mutation<
      { message: string },
      { data: { email: string; name: string; message: string } }
    >({
      query: ({ data }) => ({
        url: `/contact`,
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //   //refetch after new record is added
      //   invalidatesTags: (result, error, arg) => [{ type: "Note", id: "LIST" }],
    }),
  }),
});

export const { useSendContactMessageMutation } = contactApiSlice;
