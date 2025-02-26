import Link from "next/link";
import { db } from "~/server/db";

const mockUrls = [
  "https://u4ocvzai6f.ufs.sh/f/5zX1RPP9E6ctSGEx47MA9zoYEynhJOSNR0wWBr1vtMbjQD4e",
  "https://u4ocvzai6f.ufs.sh/f/5zX1RPP9E6ctELmgbXZGHAPpaqdrOBmLFz7NfCJEoeh0U8SI",
  "https://u4ocvzai6f.ufs.sh/f/5zX1RPP9E6ctiowIG1FLwqzWNJS4XTQdPbCokY15vDUy2e0I"
];

const mockImages = mockUrls.map((url, index) => ({
  id: index + 1,
  url,
}));

export default async function HomePage() {

  const posts = await db.query.posts.findMany();

  return (
    <main className="">
        <div className="flex flex-wrap gap-4">
          {/* {mockImages.map((image) => (
            <div key={image.id} className="w-48">
              <img src={image.url}/>
            </div>
          ))} */}

          {posts.map((post) => (
            <div key={post.id}>{post.name}</div>
          ))}

          {[...mockImages, ...mockImages, ...mockImages].map((image) => (
            <div key={image.id} className="w-48">
              <img src={image.url}/>
            </div>
          ))}

      </div>
    </main>
  );
}
