
import { apiSlice } from "@/redux/api/apiSlice";
import { ITourFilter, ITourResult } from "../../../types/tour";

export const tourApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //builder.query(ResultType, QueryArgType | void)
    getRenterTours: builder.query<ITourResult, ITourFilter>({
      query: ({ itemsPerPage, page, filters }) => ({
        url: `/tours/renters?page=${page}&size=${itemsPerPage}&filters=${JSON.stringify(
          filters
        )}`,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch {
          //no tours, clear any data in cache for this endpoint + query params
          dispatch(
            tourApiSlice.util.updateQueryData(
              "getRenterTours",
              args,
              (draft) => {
                if (!draft?.tours) return;
                draft.tours.length = 0;
                draft.total = 0;
                draft.pages = 0;
              }
            )
          );
        }
      },

      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,

      providesTags: (result, error, arg) =>
        // is result available?//data from db form = {pages, orders[]}
        result?.tours?.length
          ? [
              ...result.tours.map(({ _id: id }) => ({
                type: "Tour" as const,
                id,
              })),
              { type: "Tour", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Tour", id: "LIST" }], //if initially fetch returned 'no record found' error
    }),

    //req tour
    requestTour: builder.mutation<
      { message: string },
      {
        tourDates: Array<Date>;
        listing: string;
      }
    >({
      query: (data) => ({
        url: `/tours`,
        method: "POST",
        body: data,
      }),

      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch after new record is added
      //   invalidatesTags: (result, error, arg) => [
      //     { type: "Active", id: "LIST" },
      //     { type: "Draft", id: "LIST" },
      //   ],
    }),

    //req tour
    rescheduleTour: builder.mutation<
      { message: string },
      {
        tourDates: Array<Date>;
        id: string;
      }
    >({
      query: ({ id, ...data }) => ({
        url: `/tours/reschedule/${id}`,
        method: "PATCH",
        body: data,
      }),

      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch after new record is added
      invalidatesTags: (result, error, arg) => [{ type: "Tour", id: arg.id }],
    }),

    //cancel tour
    cancelTour: builder.mutation<
      { message: string },
      { comment: string; id: string }
    >({
      query: ({ id, ...data }) => ({
        url: `/tours/cancel/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, arg) => [{ type: "Tour", id: arg.id }],
    }),

    //End tour
    endTour: builder.mutation<
      { message: string },
      { id: string; comment: string; rating: number }
    >({
      query: ({ id, ...data }) => ({
        url: `/tours/end/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, arg) => [{ type: "Tour", id: arg.id }],
    }),

    //Delete tour
    removeTour: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/tours/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, id) => [{ type: "Tour", id }],
    }),
  }), 

  overrideExisting: true,
});

export const {
  useRequestTourMutation,
  useGetRenterToursQuery,
  useCancelTourMutation,
  useEndTourMutation,
  useRescheduleTourMutation,
} = tourApiSlice;
