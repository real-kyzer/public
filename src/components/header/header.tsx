import { User } from "./user";

export async function Header() {
  return (
    <header className="bg-primary py-4">
      <div className="mx-auto flex w-full max-w-screen-xl justify-between px-4">
        <div>
          <a href="/" rel="home" className="">
            <img src="/r2.svg" alt="Home" width={40} />
          </a>
        </div>
        <div className="text-white">
          <User />
        </div>
      </div>
    </header>
  );
}
