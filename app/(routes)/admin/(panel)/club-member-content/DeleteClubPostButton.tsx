"use client";

import { deleteClubMemberPost } from "./actions";

export function DeleteClubPostButton({ id }: { id: string }) {
  return (
    <form
      action={deleteClubMemberPost}
      onSubmit={(e) => {
        if (!confirm("Bu içerik silinsin mi?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="underline text-red-400 hover:text-red-300">
        sil
      </button>
    </form>
  );
}
