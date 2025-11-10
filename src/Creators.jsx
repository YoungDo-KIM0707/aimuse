// src/Creators.jsx
import Header from "./components/Header";

const MEMBERS = [
    {
    name: "서지우",
    role: "팀장",
    bio: "기획, AI",
    links: {
      github: "https://github.com/seojiwoo-1004",
    },
  },
  {
    name: "김태환",
    role: "팀원",
    bio: "기획, AI",
    links: {
      github: "https://github.com/TehanKim",
    },
  },
    {
    name: "최세윤",
    role: "팀원",
    bio: "기획, DevOps, Backend",
    links: {
      github: "https://github.com/naturalSy",
    },
  },
  {
    name: "김영도",
    role: "팀원",
    bio: "기획, Front-end",
    links: {
      github: "https://github.com/YoungDo-KIM0707",
    },
  },
  
];

// 아바타: 이미지가 없으면 이니셜 원형 아바타로 표시
function Avatar({ name, src }) {
  if (src) {
    return (
      <img
        src={src}
        alt={`${name} 프로필`}
        className="h-12 w-12 rounded-full object-cover ring-1 ring-zinc-200"
      />
    );
  }
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="h-12 w-12 rounded-full bg-zinc-100 text-zinc-700 grid place-items-center text-sm font-semibold ring-1 ring-zinc-200">
      {initials}
    </div>
  );
}

export default function Creators() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* 헤더 섹션 */}
        <section className="flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">크리에이터</h1>
            <p className="mt-2 text-sm text-zinc-600">
              AIMUSE 프로젝트의 제작자/기여자 목록입니다.
            </p>
          </div>
        </section>
         <section className="mt-4">
    <a
      href="https://github.com/Aimuse-2025" 
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium shadow-sm hover:bg-zinc-50 transition"
    >
      <img
        src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
        alt="GitHub"
        className="h-5 w-5"
      />
      AIMUSE 팀 GitHub 바로가기
    </a>
  </section>


        {/* 카드 그리드 */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MEMBERS.map((m) => (
            <article
              key={m.name}
              className="rounded-2xl border border-zinc-200 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <Avatar name={m.name} src={m.photo} />
                <div>
                  <div className="text-base font-semibold">{m.name}</div>
                  <div className="text-xs text-zinc-500">{m.role}</div>
                </div>
              </div>

              <p className="mt-3 text-sm text-zinc-700">{m.bio}</p>

              <div className="mt-4 flex gap-3 text-sm">
                {m.links?.github && (
                  <a
                    href={m.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 hover:opacity-80"
                  >
                    GitHub
                  </a>
                )}
                {m.links?.email && (
                  <a
                    href={m.links.email}
                    className="underline underline-offset-2 hover:opacity-80"
                  >
                    Email
                  </a>
                )}
              </div>
            </article>
          ))}
        </section>

    
        
      </main>
    </div>
  );
}
