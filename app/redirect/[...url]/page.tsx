const Page = ({
  params,
  searchParams,
}: {
  params: { url: string };
  searchParams: { back: string };
}) => {
  const url = decodeURIComponent(params.url);
  return (
    <div className="flex flex-col gap-3 items-start justify-center px-20 py-10">
      <span className="text-lg font-semibold">
        Вы покидаете этот веб-сайт, переходя по внешней ссылке. Мы не несем ответственности за
        содержимое внешнего сайта. Если вы уверены, что хотите перейти на этот сайт, пожалуйста,
        нажмите на указанную ниже ссылку.
      </span>
      <a href={url} className="hover:text-red-500">
        {url}
      </a>
      <a href={searchParams.back} className="text-lg font-bold hover:text-gray-500">
        Назад
      </a>
    </div>
  );
};

export default Page;
