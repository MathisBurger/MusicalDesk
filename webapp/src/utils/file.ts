export const openFile = (id: number) => {
  window.open(`${process.env.NEXT_PUBLIC_API_URL}/images/${id}`, "_blank");
};
