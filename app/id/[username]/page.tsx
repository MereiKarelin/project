import { Metadata } from 'next';
import { headers } from 'next/headers';

import { ProfilePage } from '@/_pages/ProfilePage/ProfilePage';

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  try {
    const username = params.username;
    const url = `${process.env.BACKEND_API_URL}/v3/users/${username}`;
    try {
      const result = await fetch(url).then((res) => res.json());
      const { fullname } = result.data;
      if (!fullname) {
        return {
          title: `@${username}`,
          description: 'Кастомизированный профиль',
        };
      }
      return {
        title: fullname + ` (@${username})`,
        description: 'Кастомизированный профиль',
      };
    } catch (error) {
      return {
        title: 'Пользователь не найден по id' + ` - (@${username})`,
        description: 'Кастомизированный профиль',
      };
    }
  } catch (error) {
    console.error(`generateMetadata failed: ${error}`);
  }
  return {
    title: 'Yourbandy',
    description:
      'Yourbandy — это революция в мире социальных сетей, предназначенная для тех, кто стремится к самовыражению и желает делиться своим творчеством с миром. Мы предлагаем вам не просто создать профиль, а вдохнуть в него жизнь с помощью расширенных кастомизаций: от изменения дизайна страницы до уникальных эффектов для ваших постов. Ваше творчество не знает границ — и наша платформа тоже!',
  };
}

const IdProfileByUsername = ({ params }: { params: { username: string } }) => {
  const headerList = headers();
  const header = Object.fromEntries(headerList);

  return <ProfilePage username={params.username} header={header} />;
};
export default IdProfileByUsername;
