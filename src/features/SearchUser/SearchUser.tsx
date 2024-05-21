import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { IPublicUser } from '@/entities/User';
import { useAuth } from '@/features/Auth/useAuth/useAuth';
import { searchChatUsersHandler } from '@/shared/api/search';
import CloseIcon from '@/shared/assets/icons/CloseIcon';
import SearchIcon from '@/shared/assets/icons/SearchIcon';
import { defaultUserAvatar } from '@/shared/consts';
import { useDebounce } from '@/shared/hooks/';
import { getId } from '@/shared/utils';

interface IProps {
  componentClassName?: string;
  iconClassName?: string;
  inputClassName?: string;
  closeIconClassName?: string;
  searchContainerClassName?: string;
  resultClassName?: string;
}

const SearchUser = (props: IProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [inputFocus, setInputFocus] = useState(false);
  const { isLogged, executeQueryCallback } = useAuth();
  const [usersList, setUsersList] = useState<IPublicUser[]>([]);
  const isSearchBarShown = inputFocus || searchValue;

  const debouncedSearch = useDebounce((val: string) => {
    executeQueryCallback(async (accessToken: string) => {
      try {
        const response = await searchChatUsersHandler(val, accessToken);
        setUsersList(response.items);
      } catch (err) {
        console.log(err);
      }
    });
  }, 200);
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (isLogged) {
      debouncedSearch(e.target.value);
    }
  };

  const router = useRouter();
  const redirectToProfile = (username: string) => {
    router.push(`/id/${username}`, { scroll: false });
    setSearchValue('');
    setInputFocus(false);
  };

  return (
    <div
      className={classNames(
        props.componentClassName,
        'flex border-0 rounded-[30px] items-center relative w-full',
        isSearchBarShown ? '!rounded-tl-[20px] !rounded-tr-[20px] !rounded-b-[0px]' : '',
      )}
    >
      <SearchIcon fill="#78E378" className={classNames(props.iconClassName, 'flex-shrink-0')} />
      <form action="" autoComplete="off" className="flex justify-between w-full">
        <input
          value={searchValue}
          autoFocus={false}
          autoCapitalize={'none'}
          onChange={onSearch}
          className={classNames(
            'w-full outline-none placeholder:text-[#78E378]',
            props.inputClassName,
          )}
          placeholder="Поиск"
          type="search"
        />
        {searchValue && (
          <CloseIcon
            className={classNames(props.closeIconClassName, 'cursor-pointer flex-shrink-0')}
            onClick={() => setSearchValue('')}
          />
        )}
      </form>
      <div
        className={classNames(
          props.searchContainerClassName,
          'absolute top-[100%] left-0 w-full grid overflow-y-scroll h-[300px]',
          isSearchBarShown ? 'grid' : 'hidden',
        )}
      >
        {usersList.length > 0 ? (
          usersList.map((user, _index) => (
            <div
              key={getId(user)}
              className={classNames('flex', props.resultClassName)}
              onClick={() => redirectToProfile(user.username)}
            >
              <img
                src={user.avatar ? user.avatar?.small_url : defaultUserAvatar}
                alt="user avatar"
                className="w-[48px] h-[48px] rounded-full mr-[10px]"
              />
              <div className="grid gap-[2px]">
                {user.fullname}
                <br />
                (@{user.username})
              </div>
            </div>
          ))
        ) : isLogged ? (
          <div className={classNames(props.resultClassName, 'text-black break-all')}>
            No results found for &quot;{searchValue}&quot
          </div>
        ) : (
          <div className={classNames(props.resultClassName, 'text-black')}>
            Сначала войдите в аккаунт
          </div>
        )}
      </div>
    </div>
  );
};
export default SearchUser;
