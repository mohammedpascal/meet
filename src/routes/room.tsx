import { createFileRoute, redirect } from '@tanstack/react-router'

/** Use `/` with the same `room` and `name` search params. */
export const Route = createFileRoute('/room')({
  beforeLoad: ({ search }) => {
    throw redirect({
      to: '/',
      search: {
        room: typeof search.room === 'string' ? search.room : '',
        name: typeof search.name === 'string' ? search.name : '',
      },
    })
  },
  component: () => null,
})
