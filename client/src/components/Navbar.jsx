function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-8 py-4 text-white">
      <h1 className="text-2xl font-bold text-blue-500">
        TextCompanion
      </h1>

      <button className="rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700">
        Upload PDF
      </button>
    </nav>
  );
}

export default Navbar;