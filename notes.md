## 공부한 내용
- #### index.html 파일의 중요성
    - 결국에 브라우저는 `html`, `css`, `js`만 인식하기 때문에 새로운 언어들(jsx, ts, tsx등등)은 변환이 되어야 한다 -> `babel`이 그 역할을 함 
    - `index.html` 파일에 서비스 전체에서 사용되는 공통 `css`를 넣어준다.  `html` 파일 매우 중요!! -> SPA개발시 매우 중요 (성능 개선, 검색엔진최적화(SEO) 등등) 
    - 검색엔진이 처음 접하게 되는 파일은 `html` 파일이기 때문이다. 
- #### 핫 리로딩 & 웹팩 데브 서버
    - `hot reloading`을 사용하면 코드를 수정 해도 애플리케이션의 상태가 사라지지 않는다. -> 코드를 수정하면 알아서 새로고침과 업데이트를 해준다. 또는 새로고침 없이 화면을 업데이트 해준다.
    - `hot reloading`을 하려면 서버가 필요하다 -> `webpack-dev-server`(개발용 서버) 설치 -> `@pmmmwh/react-refresh-webpack-plugin react-refresh` lib 설치 -> webpack 설정
    - `webpack-dev-server`는 빠른 실시간 리로드 기능을 갖춘 개발 서버이다.
- #### react router
    - 기본적으로 <Switch></Switch>로 여러 개의 path(uri 경로)를 감싸준다. 
    - `Switch`는 전등불 같은 역할을 한다 -> 여러 상태 중에서 하나를 선택하면 다른 상태들은 꺼지고 선택한 것만 켜진다. 즉, 여러 개의 path중 하나만 선택하는 역할(여러 route중 하나의 route만 활성화)
    - <Redirect /> -> 다른 페이지로 이동시켜 주는 역할 ex) <Redirect exact path="/" to="/login" /> -> URL 경로가 "/"일경우 "/login"경로로 이동된다.  
    - <Route /> -> 컴포넌트들을 화면에 띄워주는 역할 ex) <Route path="/login" component={LogIn} /> -> 경로가 "/login"일때 LogIn컴포넌트를 화면에 보여준다.
    - `exact` 속성을 사용하면 path의 값이 정확하게 일치해야 라우팅이 된다.
- #### SPA route
    - SPA에서는 url은 없고 index.html만 존재한다. (메인 주소만 존재한다.)
    - historyApi가 가짜로 url을 만들어 준다. (가짜 주소를 뒤에 입력을 해준다.)
    - 새로고침할 경우 url 주소는 서버로 전송된다. -> 서버는 메인 주소 url만 알고 다른 경오는 모른다. (ex localhost:8080만 알고 localhost:8080/login 등 뒤에 붙은 path는 모름)
    - 즉 어떤 path를 입력하든 메인 페이지(index.html)로 가게된다.
    - webpack devServer에서 historyApiFallback: true,로 설정해주면  devServer가 가짜주소(메인 주소 뒤에 붙는 /login, /signup 등등)를 있는 주소처럼 적용하게 해준다.
- #### 코드 스플리팅
    - SPA의 경우 페이지 수가 많아 지면 (js파일의 용량이 커진다) 화면 로딩 시간이 길어져 UX가 안좋아 질 수 있다. 그럴경우 코드스플리팅을 사용한다.
    - 코드 스플리팅을 하게 되면, 지금 당장 필요한 코드가 아니라면 따로 분리시켜서, 나중에 필요할때 불러와서 사용 할 수 있습니다. 이를 통하여, 페이지의 로딩 속도를 개선 할 수 있다.
    - 코드 스플리팅으로 당장 필요한 컴포넌트가 아닌 경우 불러오지 않고, 필요한 컴포넌트는 그때그때 불러온다.
    - 어떤식으로 분리하나? -> 페이지 별로 분리 한다(페이지 단위로 적용한다.) 예를 들어 login페이지에서는 signup 페이지를 불러올 필요가 없다. / SSR과 SSR이 필요없는 컴포넌트를 분리한다. (서버 영역에서 용량 감소)
    - `@loadable/component` 라이브러리를 사용해서 코드 스플리팅 해준다. (ex const LogIn = loadable(() => import('@pages/LogIn'));)
- #### css-in-js(styled-components대신 emotion 사용)
    - @emotion/styled에서 styled.스타일을 적용할 태그를 입력 (const Header = styled.header`css작성` -> header태그 css를 작성한다는 의미)
    - 스타일드 컴포넌트로 만들 때 변수를 많이 만드는 셈이므로 큼지막한 컴포넌트만 변수로 만들고 짜잘한 것들은 (SCSS문법)& 같은 선택자 적극 활용해야 변수 이름짓기를 최소화할 수 있음. (변수명 만드는게 가장 어려움)
    - emotion을 babel과 연결하면 추가적인 기능을 제공한다. (ex 컴포넌트의 자식으로 html태그가 아닌 다른 컴포넌트를 변수로 사용할 수 있다.)
    - @emotion/babel-plugin를 설치한다. -> webpack설정을 해준다.
    - plugin과 설정을 함께 작성하려면 배열로 감싸서 2번째 인자로 설정을 추가 해준다
    ```
    env: {
            development: {
              plugins: [['@emotion', { sourceMap: true }], require.resolve('react-refresh/babel')],
            },
            production: {
              plugins: ['@emotion'],
            },
           }, 
    ```
    - 
- #### React
    - class방식이 아닌 함수형 컴포넌트를 사용하면 함수의 특성상 호출(컴포넌트를 실행하면)되면 매번 함수 내부에 선언된 전체가 재실행된다. -> 표현식(변수, 다른 함수들)도 매번 다시 호출된다.(함수형 컴포넌트 안에 선언된 함수들도 매번 재생성, 재실행된다.)
    - 예를들어 자신의 state나 부모에게 받은 props가 변경되었을때 마다 전체가 다시 렌더링되는 것이다. 따라서 useCallback으로 감싸지 않을 경우 함수들이 매번 재생성된다 
    - 성능 최적화를 위해서 useCallback, useMemo hook을 사용한다.
    - 이벤트 처리할 때 useCallback()을 사용해야 성능 최적화를 할 수 있다. 
    - useCallback(fn, [deps]) -> deps안에는 useCallback에서 사용하는 변수들(state)을 전부 입력해야 한다. -> useCallback이란 hook 자체가 deps에 있는 변수 중 값이 하나라도 바뀌기 전까지 fn(함수)를 캐슁 즉, 기억해 둬라라는 의미이다. (변수 중 하나라도 값이 바뀌는 경우 함수를 새로만든다. ) (ex const onChangeEmail = useCallback( () => {}, [deps]))
    - react hooks를 잘 사용하는게 중요하다. -> hooks를 이용해서 커스텀 hook을 만들 수 있다.(커스텀 hook을 만들기 전 중복되는 부분이 어떤 건지를 잘 알고 있어야 한다.)
    - 코드를 (대부분) 완성한 다음 중복된 부분이 있으면 제거를 한다.(리팩토링, 최적화 등을 할때)
    - 비밀번호랑 비밀번호 확인을 바꿀경우 둘이 일치하는지 체크를 해야 한다. -> 따로 에러들(useState로 새로 에러만 확인하는 상태를 만든다.)을 정리해서 체크한다.
    - 전체적인 상태는 redux로 비동기 처리는 redux-saga, redux-thunk로 관리를 해왔다. 이렇게 사용할 경우 비동기 로직과 컴포넌트가 분리된다는 장점이 존재한다.
    - 컴포넌트 하나에서만 사용하는 비동기 로직이 있을 경우 따로 분리할 필요가 없다. 이럴경우 redux로 관리하지 말고 해당 컴포넌트 내부에서 비동기 처리를 한다.(redux로 관리할 경우 코드만 길어지고 복잡해진다.)
    - 해당 프로젝트에서는 redux를 사용하지 않고 비동기 요청은 axios라이브러리를 사용한다.
- #### Typescript
    - TS는 간단하게 정의하면 JS의 변수, 매개변수, 리턴값에 타입을 붙여주는 것이다.
    - TS로 시작하는 에러는 타입스크립트 전용 에러이다.
    - TS는 변수, 리턴값은 추론을 하기때문에 타입을 붙여주지 않아도 되지만 매개변수는 타입 추론을 잘 못한다. 매개변수는 타입을 확실히 붙여줘야 한다.(TS가 인라인 콜백 함수는 매개변수를 추론해준다.)
    - any타입을 사용하지 않을 경우 any 대신 ChangeEvent<HTMLInputElement>, e.target.value 대신 e.target.value as unknown as T 넣으면 해결됩니다.
    - 자바스크립트대로 코딩을 하고 타입 추론을 못하겠다고 에러가 발생한 경우 타입을 넣어준다.
- #### 기타
    - 강의 수강하며 발생한 npm 오류 해결 방법들 모음
        - `npm rm lib` -> 해당 패키지를 삭제할 수 있다.
        - `npm install @pmmmwh/react-refresh-webpack-plugin` 명령어 실행시 오류가 발생한 경우 
        - npm ERR! Fix the upstream dependency conflict, or retry | npm ERR! this command with --force, or --legacy-peer-deps
        - 명령어 앞에 --force || --legacy-peer-deps 키워드를 붙여 준다 (ex `npm install --force @pmmmwh/react-refresh-webpack-plugin`)
    - 프론트 개발을 할때 back-end가 없어도 back-end가 있는 것 처럼 코드를 작성할 수 있어야 한다. -> 더미 데이터를 불러와서 프론트 개발을 할 수 있어야 한다.