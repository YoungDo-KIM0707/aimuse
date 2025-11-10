import Header from "./components/Header";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-bold">개인정보 처리방침</h1>
        <p className="mt-4 text-gray-700">여기에 개인정보 처리방침 내용을 넣으세요.</p>
      </main>
    </div>
  );
}
