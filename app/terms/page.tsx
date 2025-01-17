import LawHeader from '@/widgets/LawHeader/LawHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Пользовательское соглашение',
  description: 'Пользовательское соглашение платформы Yourbandy',
};

const TermsPage = () => {
  return (
    <div className="justify-center grid gap-3">
      <LawHeader />
      <div className="2xl:w-[600px] xl:w-[600px] lg:w-[600px] md:w-[600px] sm:w-[600px] grid gap-3">
        <strong className="text-2xl text-center">Пользовательское соглашение</strong>
        <strong>1. Ваши отношения с нами</strong>
        <p>
          1.1. «Yourbandy» (далее «Мы») предоставляет вам доступ к своим сервисам. Вы, в свою
          очередь, при использовании наших сервисов, действуете как Пользователь.
        </p>
        <p>
          1.2. Наши услуги предназначены для некоммерческого, коммерческого и личного использования.
        </p>
        <p>
          1.3. В случае нарушения условий данного соглашения, мы оставляем за собой право удалять
          нарушающие контент посты и применять ограничения к вашему аккаунту.
        </p>
        <p>
          1.4. Принимая это соглашение, вы соглашаетесь на сбор и использование ваших данных в
          аналитических, обучающих целях ИИ и других целях, предусмотренных настоящим соглашением.
        </p>
        <p>
          1.5. Аккаунты, созданные пользователями младше 14 лет, будут заблокированы до достижения
          ими возраста 18 лет. Пользователи, фальсифицирующие свой возраст, несут ответственность за
          свои действия.
        </p>
        <p>
          1.6. Аккаунты пользователей в возрасте от 14 до 18 лет не будут попадать в рекомендации.
        </p>
        <p>
          1.7. Запрещается публикация приватного контента пользователями в возрасте от 13 до 16 лет.
        </p>
        <p>
          1.8. Разрешаем проведение частной рекламы между пользователями без взимания комиссии со
          стороны сайта (для подписчиков). Репосты не считаются рекламой.
        </p>
        <strong>2. Контент</strong>
        <p>
          2.1. Весь контент Yourbandy, включая программное обеспечение, изображения, тексты,
          графику, логотипы и другие объекты интеллектуальной собственности, принадлежит Yourbandy
          или лицензирован Yourbandy. Использование контента Yourbandy не разрешается без нашего
          согласия или согласия наших лицензиаров. Мы и наши лицензиары оставляем за собой все
          права.
        </p>
        <p>
          2.2. Репосты для ознакомления разрешены при условии указания исходного автора контента.
        </p>
        <p>
          2.3. Контент, отмеченный как NSFW (материал для взрослых), доступен только пользователям
          старше 21 года и с особыми настройками поиска.
        </p>
        <strong>3. Авторское право и интеллектуальная собственность</strong>
        <p>
          3.1. Контент, созданный пользователями, защищен авторским правом. Любое
          несанкционированное копирование или использование контента без согласия автора запрещено.
        </p>
        <p>
          3.2. В случае обнаружения нарушения авторских прав, автор может обратиться в службу
          поддержки для решения вопроса.
        </p>
        <p>
          3.3. Пиратский контент запрещен. В случае жалобы правообладателя контент будет удален.
        </p>
        <p>3.4. Посты, нарушающие авторские права, могут быть удалены по решению модерации.</p>
        <strong>4. Возмещение убытков</strong>
        <p>
          4.1. Вы соглашаетесь защищать, возмещать потери и освобождать от ответственности
          Yourbandy, ее материнские, дочерние и аффилированные компании, и каждого из
          соответствующих должностных лиц, директоров, сотрудников, агентов и консультантов и
          освобождаете их от всех претензий, обязательств, затрат и расходов, включая, но не
          ограничиваясь, судебные издержки и расходы, возникающие в результате нарушения вами или
          любым пользователем данного пользовательского соглашения, или вытекающих из нарушения
          обязательств, заявлений и гарантий в соответствии с настоящим Пользовательским
          соглашением.
        </p>
        <strong>5. Разжигание ненависти</strong>
        <p>
          5.1. Контент, направленный на разжигание ненависти, строго запрещен и подлежит удалению.
        </p>
        <p>5.2. Запрещены открытые призывы к суициду, травля, разжигание любых видов ненависти.</p>
        <p>5.3. Реклама скама, ставок, наркотиков строго запрещена.</p>
        <p>
          5.4. Несанкционированная публикация контента для взрослых приведет к ограничениям
          аккаунта.
        </p>
        <strong>6. Файлы Cookie</strong>
        <p>
          6.1. Используя наши сервисы, вы соглашаетесь с использованием файлов Cookie в соответствии
          с нашей политикой.
        </p>
      </div>
    </div>
  );
};
export default TermsPage;
