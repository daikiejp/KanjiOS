import KanjiList from '@/components/kanjios/KanjiList';

export default function KanjiListPage() {
  const kanjisPerPage = 20;

  return (
    <div>
      <KanjiList kanjisPerPage={kanjisPerPage} />
    </div>
  );
}
