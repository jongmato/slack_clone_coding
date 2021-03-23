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
    - 비동기 요청에 관련해서 변경되는 부분 -> (`.then().catch()`에서)setState하는 부분은 비동기 요청하기 전에 초기화를 해주는 것이 좋다.
    - react-router에서는 a태그 대신에 Link태그를 import해서 사용하는게 좋다. (<a href="/login">로그인</a> -> <Link to="/login">로그인</Link>)
    - a태그를 사용하면 화면전환 시 새로고침이 된다는 단점이 있다. Link태그를 사용하면 SPA는 유지되면서 화면만 변경해 준다.(새로고침 없음)
    - React에서 타입 에러가 발생하면 타입에 FC입력
    - FC안에 {children}타입이 들어가 있다. {children}을 사용하는 컴포넌트의 경우 FC타입 -> {children}을 사용하지 않는 컴포넌트의 경우 VFC타입 사용
    - Channel컴포넌트에서 <Workspace></Workspace>안에 있는 요소들이 Workspace컴포넌트의 {children}이 된다.
    - return은 항상 hooks보다 아래에 위치해야 한다. -> 아닐경우 에러 발생 (모든 hooks를 모두 작성하고 마지막 hook 아래에 작성한다.)
- #### Typescript
    - TS는 간단하게 정의하면 JS의 변수, 매개변수, 리턴값에 타입을 붙여주는 것이다.
    - TS로 시작하는 에러는 타입스크립트 전용 에러이다.
    - TS는 변수, 리턴값은 추론을 하기때문에 타입을 붙여주지 않아도 되지만 매개변수는 타입 추론을 잘 못한다. 매개변수는 타입을 확실히 붙여줘야 한다.(TS가 인라인 콜백 함수는 매개변수를 추론해준다.)
    - any타입을 사용하지 않을 경우 any 대신 ChangeEvent<HTMLInputElement>, e.target.value 대신 e.target.value as unknown as T 넣으면 해결됩니다.
    - 자바스크립트대로 코딩을 하고 타입 추론을 못하겠다고 에러가 발생한 경우 타입을 넣어준다.
    - **@types**
        - 타입스크립트를 사용할 때 모든 패키지가 @types를 지원하는 것은 아니다.
        - 어떤 패키지를 설치할 때 언제 앞에 @types가 붙은 패키지를 추가로 설치해야 하는지 판단을 잘해야한다. 
        - [npm공식문서](https://www.npmjs.com/)에서 설치할 패키지를 검색을 한다.
        - 검색을 하면 패키지 이름 옆에 **DT** 라는 마크가 있으며 마우스를 위에 올려보면 @types/해당패키지 를 설치해야 한다고 나온다.
- #### Javascript
    - axios.post('url', {보낼 data}).then(() => {요청이 성공했을 경우}).catch((error) => {요청이 실패했을 경우}).finally(() => { 무조건(성공했든 실패했든) 실행되는 코드 -> 성공하든 실패하든 공통적으로 처리할 로직을 여기에 작성해 준다. }) ->  `.then.catch`, `try{}....catch{}`문 둘다에 finally생김
    - 정확한 에러구문은 error.response에 담겨있다.
    - 타입스크립트는 오타가 발생할 경우 에러표시가 나지만 자바스크립트는 오타가 발생해도 에러표시가 안되는 경우도 있다. 따라서 자바스크립트는 eslint를 사용해야 오타를 잡을 수 있다.
- #### SWR (react-query, GraphQL-Apollo 같은 기능을 한다. 취향에 따라 선택)
    - Redux의 대안
    - `npm install swr`
    - 기본적으로 요청을 보내서 받아온 데이터를 저장해준다고 생각하면 된다. (보통은 GET요청)
    - SWR이 전역적으로 데이터를 관리해 준다.
    - useSWR('통신할 주소를 입력', fetcher함수)
    - fetcher함수는 주소를 어떻게 처리할지를 정해준다. -> 함수를 직접 구현해야 한다.
    - 로딩 상태도 알 수 있다. -> 데이터가 존재하지 않으면 로딩 상태이다.
    - swr을 사용하면 다른 탭을 갔다 오면 자동으로 요청을 다시 보내준다. (요청을 보내는 시기는 내부적으로 정해져 있고 사용자가 커스텀할 수 있다.) -> 화면을 항상 최신으로 유지할 수 있다.
    - (프론트엔드와 백엔드의 서버 주소가 달라서 쿠키 생성이 안된다.)로그인 체크를 위해서는 쿠키가 필요하다 쿠키를 생성하기 위해서 fetcher함수에 withCredentials인자를 추가 해준다.
    ```
        const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then((response) => response.data);
    ```
    - SWR을 사용할 때 컨트롤해야 하는 것
        1. 로그인 요청 -> 로그인 완료 -> SWR을 호출 / 이렇게 사용자가 원할 때 SWR을 호출하는 것 
            - revalidate라는 함수를 이용한다.
        2. SWR은 몇 초 간격으로 주기적으로 요청을 한 번씩 더 보낸다. (요청이 너무 빈번한 경우 서버에 무리가 간다.) / 주기적으로 SWR이 호출하는 것을 막는 것 
            - useSWR('url', fetcher, {option}) 3번째 옵션자리에 dedupingInterval옵션을 추가해 준다.
            - useSWR('url', fetcher, {dedupingInterval: 100000}) -> 100초마다 한 번씩 요청한다는 의미 (dedupingInterval초를 엄청 늘려준다.)
            - 주기적으로 호출은 되지만 dedupingInterval에서 설장한 기간 내에는 캐시에서 불어온다.
        3. 공식 문서에 많은 옵션들이 설명되어있다. 
            - [SWR공식문서](https://swr.vercel.app/docs/options) 참조
    - swr 활용법(optimistic ui)
        - swr을 사용할 때 요청을 많이 보내는 것을 막아줘야 한다.
        - revalidate -> 요청을 한 번더 보낸다는 단점이 있다.
        - revalidate는 서버로 요청을 한 번 더 보내서 데이터를 다시 가져온다.
        - mutate는 서버로 요청을 보내지 않고 데이터를 수정한다. (서버에 요청을 보내지 않고 클라이언트에서 직접 데이터를 조작하고 싶을 때 revalidate대신에 사용한다.)
        - mutate(data, shouldRevalidata:boolean)
        - shouldRevalidata: false 로 해줘야 서버에 요청을 보내지 않는다.
        ```js
        const { data, error, revalidate, mutate } = useSWR('/api/users', fetcher);
        axios.post(...).then(() => {revalidate();})
        axios.post(...).then((response) => {mutate(response.data, false);})
        //범용적으로 사용되는 mutate -> swr 패키지에서 불러올때
        import useSWR, { mutate } from 'swr';
        axios.post(...).then((response) => {mutate('url',response.data, false);})
        //axios.post(...).then((response) => {mutate(key,data);}) -> key에는 서버주소를 입력하고 ,data에는 데이터 입력 범용적으로 사용할 때는 key를 꼭 입력해 줘야 한다.
        ```
        - 사용자 요청이 실시간으로 반영되는 부분에 mutate를 사용한다 (ex: 인스타 좋아요, 유튜브 좋아요 버튼 클릭시 바로 하트, 손가락에 색이 칠해진다.)
        - 사용자 이벤트가 발생할때 먼저 실행을 하고(하트에 불이 들어온다, 좋아요 손가락에 불이 들어온다 등등) 나중에 서버에 점검 요청을 한다. -> 점검에 성공하면 그대로 두고 실패할 경우 실행한 액션이 취소된다. (하트 불이 꺼진다 등등)
        - 이렇게 먼저 성공한다고 생각하고 실행을 하고 나중에 점검하는 것을 optimistic ui라고 한다.
        - optimistic ui를 구현하려면 shouldRevalidata: true로 해준다. (false일 경우 서버에 요청을 안 보낸다. local data를 그대로 수정하는 것임)
        - swr에서 mutate를 지원해줘서 optimistic ui를 구현할 수 있다.
        - Pessimistic UI (optimistic ui의 반대)
            - 무조건 서버에 먼저 요청을 보내고 성공하면 상태를 변경한다.
            - 기본적으로는 Pessimistic UI이다. (따로 설정할 필요가 없다)
    - fetcher
        - get요청만 가능한 것이 아니다. 
        - 요청의 종류보다는 가져오는 data가 중요 (get, post, put, delete 등등 결국은 data를 가져온다.)
        - 직접 구현해서 다양한 요청을 통해 데이터를 다룰 수 있다.
        - fetcher를 다양하게 구현하면 좋다 (fetcher를 제대로 활용하지 못하면 SWR를 잘 사용하지 못 하는 것이다.)
        - fetcher함수를 여러개를 만들어서 서버에서 주는 데이터를 fetcher함수에서  변조해서 다룬다.
        ```js
            import axios from 'axios';
            const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then((response) => response.data);
            const fetcherlength = (url: string) => axios.get(url, { withCredentials: true }).then((response) => response.data.length);
            const fetcherPost = (url: string) => axios.post(url, {data}, { withCredentials: true }).then(() => {});
            export default fetcher;
        ```
    - swr은 비동기 요청에만 관련된 것이 아니다.
        ```js
            const { data } = useSWR('Hi', (key) => { localStorage.setItem('data', key); return localStorage.getItem('data'); });
            //이렇게 SWR을 사용해서 localStorage에 데이터를 저장하고 데이터를 가져오고 할 수 있다.
        ```
- #### 워크스페이스 만들기 챕터
    - 그라바타(gravatar)
        - [gravatar홈페이지](https://ko.gravatar.com/)
        - 랜덤한 이미지를 만들어 주는 서비스
        - 프로필 사진이 없는 사용자에게 랜덤한 이미지를 제공해 줄 경우 유용하게 사용된다.
        - 계속 랜덤한 이미지를 생성하는 것이 아닌 이메일 별로 1:1 매칭을 해줘서 한 이메일에 하나의 이미지를 계속해서 사용
        - `npm i gravatar @types/gravatar`
    - 중첩 라우터
        - Channel이랑 DM은 레이아웃으로 워크스페이스를 사용한다.
- #### 기타
    - 강의 수강하며 발생한 npm 오류 해결 방법들 모음
        - `npm rm lib` -> 해당 패키지를 삭제할 수 있다.
        - `npm install @pmmmwh/react-refresh-webpack-plugin` 명령어 실행시 오류가 발생한 경우 
        - npm ERR! Fix the upstream dependency conflict, or retry | npm ERR! this command with --force, or --legacy-peer-deps
        - 명령어 앞에 --force || --legacy-peer-deps 키워드를 붙여 준다 (ex `npm install --force @pmmmwh/react-refresh-webpack-plugin`)
    - 프론트 개발을 할때 back-end가 없어도 back-end가 있는 것 처럼 코드를 작성할 수 있어야 한다. -> 더미 데이터를 불러와서 프론트 개발을 할 수 있어야 한다.
    - 프론트에서 서버로 요청을 보낼 경우 개발자도구의 네트워크 탭을 켜논 상태로 요청을 보내서 확인한다.
    - 주소(포트)가 다르면 서로 요청이 안된다. -> 프론트와 백엔드의 포트 번호가 다르면 Method가 OPTIONS인 요청을 한 번씩 더 보낸다.
    - 해당 프로젝트에서 프론트의 포트는 3090, 백엔드의 포트는 3095이다. 이렇게 포트 번호가 다르면 원래는 프론트, 백이 서로 요청이 안된다. 요청을 보내면 CORS에러 발생
    - CORS에러가 발생하면 해결 방법이 back-end에서 해결하는 방법이 있고 프론트단에서 해결하는 방법이 있다.
    - CORS에러가 발생하면 프론트단에서 webpack devServer에 proxy설정을 해준다. -> OPTIONS 요청도 안보내진다.
        ```js
        devServer: {
            proxy: {
                '/api/': { //프론트엔드에서 /api/시작하는 url 요청은 주소를 target으로 하겠다.
                    target: 'http://localhost:3095', //back-end 포트 주소
                    changeOrigin: true,
                },
            },
        },
        ```
    - proxy를 설정 함으로 프론트와 백 둘다 localhost일때 CORS에러를 피할 수 있다.  (예를 들어 백엔드는 실사용 주소이고 프론트엔드는 localhost인 경우에는 안된다.)
    - 로그인 테스트할 경우 팁
        - back-end 서버가 localhost인 경우 로그인한 사용자의 정보를 메모리에 저장하므로 서버를 종료했다가 다시 작동하면 로그인이 풀린다.
        - 서버를 종료 못하는 경우 개발자 도구 -> Application 탭 -> Cookies -> 해당 쿠키를 지우면 로그아웃된다. (쿠키를 지우면 로그아웃이다.)
    - 프론트 서버와 백엔드 서버의 주소(도메인)가 다르면 쿠키 생성/전달이 안된다.
        - 이문제를 해결하기 위해 axios요청에서 withCredentials인자를 추가해 준다.
        ```js
            //GET
            const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then((response) => response.data);
            //POST
            axios.post('/api/users/login',{ email, password },{withCredentials: true,},)
        ```
        - GET요청일 경우 2번째 인자로 추가하고 POST요청일 경우 3번째 인자로 추가한다.
        - 쿠키는 항상 백엔드에서 생성을 해주는 것이다. 
        - 백엔드에서 생성을 하고 프론트엔드 브라우저가 기억을 하게 만들어 준다.
        - 프론트에서는 저장한 쿠키를 매 요청마다 백엔드로 보내준다.