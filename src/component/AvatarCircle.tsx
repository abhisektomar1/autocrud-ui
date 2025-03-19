
const AvatarCircle = ({
  name,
  backgroundColor = "bg-blue-500",
}: {
  name: string;
  backgroundColor: string;
}) => {
  const firstLetter = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div
      className={`${backgroundColor} bg-inherit p-1 rounded-xl flex items-center justify-center text-gray-500 text-sm font-semibold`}
    >
      {firstLetter}
    </div>
  );
};

export default AvatarCircle;
