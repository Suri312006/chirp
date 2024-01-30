import type { RouterOutputs, } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import Image from "next/image";
import Link from "next/link";
dayjs.extend(relativeTime)


type PostWithUser = RouterOutputs["post"]["getAll"][number]
const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div key={post.id} className="flex font-bold border-b border-slate-400 p-4 gap-3">
      <Image width={56} height={56} className="h-14 w-14 rounded-full" src={author.profilePicture} alt="post author pfp" />
      <div className="flex flex-col">
        <div className="flex text-slate-300 gap-2">
          <Link href={`/@${author.username}`}><span>{`@${author.username} `}</span></Link>
          <Link href={`post/${post.id}`}><span className="font-light">{`  ·  ${dayjs(post.createdAt).fromNow()}`}</span></Link>



        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>

  )
}

export default PostView;
