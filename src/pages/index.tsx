import Head from "next/head";
import Link from "next/link";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";

const CreatePostWizard = () => {
  // the useUser was defined gobally in _app.tsx
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex gap-3 w-full">
      <img className="h-14 w-14 rounded-full" src={user.imageUrl} alt="Profile Image" />


    <input className="bg-transparent grow outline-none " placeholder="Type Some emojis.. "/>
    </div>
  )

}

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  const user = useUser();
  // never want a user to connect to the database directly, use tRPC to do that
  // wait this is so clean than supabase bro omg
  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <div> Loading.. </div>
  if (!data) return <div> Something went terribly wrong </div>

  console.log(data);

  return (
    <>
      <Head>
        <title>
          What the fuck gang
        </title>
      </Head>

      <main className="flex justify-center h-screen">

        <div className="w-full md:max-w-2xl border-x border-slate-400">

          <div className="flex border-b border-slate-400 p-4 ">
            {!user.isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {!!user.isSignedIn && <CreatePostWizard />}
            {!!user.isSignedIn && <SignOutButton />}
          </div>

          <div className="flex flex-col">
            {[...data, ...data]?.map((post) => (

              <div key={post.id} className="border-b border-slate-400 p-8"> {post.content}</div>

            ))}
          </div>


        </div>
      </main>
    </>
  );
}
