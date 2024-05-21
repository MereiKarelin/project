//@ts-nocheck
import './App.css';

import * as React from 'react';

import { IPublicUser } from '@/entities/User';
import { LOCALSTORAGE_ITEMS } from '@/shared/consts/backendExcCodes';

import Editor, { makeScenaFunctionComponent } from '../EditorOld';
import { SESSION_STORAGE_ITEMS } from '../EditorOld/consts';
import { ElementInfo, ScenaProps } from '../EditorOld/types';

const userInfoStorage = window.localStorage.getItem(LOCALSTORAGE_ITEMS.USER_DATA);
const userInfo: IPublicUser = userInfoStorage ? JSON.parse(userInfoStorage) : null;
const UserInfo = makeScenaFunctionComponent('UserInfo', function UserInfo(props: ScenaProps) {
  return (
    <div
      style={{
        width: 162,
        height: 56,
        padding: '4px 46px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        background: 'rgba(1, 22, 39, 0.60)',
        boxShadow: '0px 4px 39px 0px rgba(0, 86, 76, 0.15)',
        backdropFilter: 'blur(10px)',
        flexDirection: 'column',
        textAlign: 'center',
        color: '#F5F5F5',
      }}
      data-scena-element-id={props.scenaElementId}
    >
      <strong
        data-scena-element-id={props.scenaElementId}
        style={{
          fontWeight: 700,
          fontSize: '14px',
          lineHeight: '24px',
          width: 69,
          height: 24,
        }}
      >
        {userInfo?.fullname}
      </strong>
      <p
        data-scena-element-id={props.scenaElementId}
        style={{
          fontSize: 12,
          fontWeight: 400,
          lineHeight: '24px',
          width: 39,
          height: 24,
        }}
      >
        {userInfo.username}
      </p>
    </div>
  );
});

class App extends React.Component {
  public editor = React.createRef<Editor>();

  public render() {
    return (
      <div className="app">
        <Editor ref={this.editor} debug={false} />
        {/*<div className="bottom">*/}
        {/*    bottom*/}
        {/*</div>*/}
      </div>
    );
  }

  public componentDidMount() {
    // const savedScreen = window.localStorage.getItem(SESSION_STORAGE_ITEMS.CUSTOMIZATION_SCREEN || null)
    const savedElementsJSON = window.localStorage.getItem(
      SESSION_STORAGE_ITEMS.CUSTOMIZATION_SAVED_JSON_DESKTOP,
    );
    const url = window.location.href;
    const defaultElemets: ElementInfo[] = url.includes('customization/post')
      ? []
      : [
          {
            jsx: userInfo.avatar ? (
              <img src={userInfo.avatar.large_url} alt="avatar" />
            ) : (
              <div
                className="moveable"
                contentEditable="true"
                suppressContentEditableWarning={true}
                style={{
                  background: 'rgba(1, 22, 39, 0.60)',
                }}
              />
            ),
            name: '(Avatar)',
            frame: {
              position: 'absolute',
              left: '50%',
              top: '25%',
              width: '162px',
              height: '162px',
              'font-size': '40px',
              transform: 'translate(-125px, -100px)',
              'border-radius': '100%',
            },
          },

          {
            jsx: <UserInfo contentEditable="true" suppressContentEditableWarning={true} />,
            name: '(User-info)',
            frame: {
              position: 'absolute',
              left: '50%',
              top: '38%',
              transform: 'translate(-125px, -16px)',
            },
          },
          // {
          //   jsx: (
          //     <div
          //       className="moveable"
          //       contentEditable="true"
          //       suppressContentEditableWarning={true}
          //     >
          //       Description
          //     </div>
          //   ),
          //   name: '(Description)',
          //   frame: {
          //     position: 'absolute',
          //     left: '0%',
          //     top: '65%',
          //     width: '400px',
          //     'font-size': '14px',
          //     'text-align': 'center',
          //     'font-weight': 'normal',
          //   },
          // },
        ];

    // (window as any).a = this;
    let savedElements;
    if (savedElementsJSON) {
      savedElements = JSON.parse(savedElementsJSON);

      if (savedElements?.length !== 0) {
        void this.editor.current?.loadDatas(savedElements).then((targets) => {
          void this.editor.current?.setSelectedTargets([targets[0]], true);
        });
      }
    } else {
      void this.editor.current?.appendJSXs(defaultElemets, true).then((targets) => {
        void this.editor.current?.setSelectedTargets([targets[0]], true);
      });
    }
  }
}

export default App;
