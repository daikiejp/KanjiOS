import { Badge } from "@/components/ui/badge";

const colors = {
  N1: "#000000",
  N2: "#8B0000",
  N3: "#FF8C00",
  N4: "#FFD700",
  N5: "#32CD32",
};

function Jlpt({ jlpt }: { jlpt: 1 | 2 | 3 | 4 | 5 }) {
  const colorKey = `N${jlpt}` as keyof typeof colors;
  const color = colors[colorKey] || "#171717";
  return (
    <Badge
      style={{ backgroundColor: color, color: "#fff" }}
      variant="secondary"
    >
      JLPT N{jlpt}
    </Badge>
  );
}

export default Jlpt;
