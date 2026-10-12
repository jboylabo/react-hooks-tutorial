import { useQuery } from '@tanstack/react-query'

type User = {
  id: number
  name: string
  email: string
  phone: string
  website: string
  company: {
    name: string
  }
}

const usersUrl = 'https://jsonplaceholder.typicode.com/users'

async function fetchUsers(): Promise<User[]> {
  const response = await fetch(usersUrl)
  if (!response.ok) {
    throw new Error(`ユーザー一覧の取得に失敗しました (${response.status})`)
  }
  return response.json()
}

export default function ListView() {
  const { data: users, isPending, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-sky-100">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-16">
        <header className="mb-4">
          <p className="text-sm font-medium tracking-wide text-sky-700">USERS</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">ユーザー一覧</h1>
        </header>
        {isPending ? <p className="text-slate-600">読み込み中...</p> : null}
        {isError ? (
          <p className="rounded-2xl border border-red-200 bg-white px-5 py-4 text-red-700">
            {error.message}
          </p>
        ) : null}
        {users?.map((user) => (
          <article
            key={user.id}
            className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-slate-900">{user.name}</h2>
            <p className="mt-2 text-slate-600">{user.email}</p>
            <p className="text-slate-600">{user.phone}</p>
            <p className="text-slate-600">{user.website}</p>
            <p className="mt-3 text-sm text-sky-800">{user.company.name}</p>
          </article>
        ))}
      </div>
    </main>
  )
}
