## 공부한 내용
- ### index.html 파일의 중요성
    - 결국에 브라우저는 `html`, `css`, `js`만 인식하기 때문에 새로운 언어들(jsx, ts, tsx등등)은 변환이 되어야 한다 -> `babel`이 그 역할을 함 
    - `index.html` 파일에 서비스 전체에서 사용되는 공통 `css`를 넣어준다.  `html` 파일 매우 중요!! -> SPA개발시 매우 중요 (성능 개선, 검색엔진최적화(SEO) 등등) 
    - 검색엔진이 처음 접하게 되는 파일은 `html` 파일이기 때문이다. 
- ### 핫 리로딩 & 웹팩 데브 서버
    - `hot reloading`을 사용하면 코드를 수정 해도 애플리케이션의 상태가 사라지지 않는다. -> 코드를 수정하면 알아서 새로고침과 업데이트를 해준다. 또는 새로고침 없이 화면을 업데이트 해준다.
    - `hot reloading`을 하려면 서버가 필요하다 -> `webpack-dev-server`(개발용 서버) 설치 -> `@pmmmwh/react-refresh-webpack-plugin react-refresh` lib 설치 -> webpack 설정
    - `webpack-dev-server`는 빠른 실시간 리로드 기능을 갖춘 개발 서버이다.
- ### react router
    - 기본적으로 <Switch></Switch>로 여러 개의 path(uri 경로)를 감싸준다. 
    - `Switch`는 전등불 같은 역할을 한다 -> 여러 상태 중에서 하나를 선택하면 다른 상태들은 꺼지고 선택한 것만 켜진다. 즉, 여러 개의 path중 하나만 선택하는 역할(여러 route중 하나의 route만 활성화)
    - <Redirect /> -> 다른 페이지로 이동시켜 주는 역할 ex) <Redirect exact path="/" to="/login" /> -> URL 경로가 "/"일경우 "/login"경로로 이동된다.  
    - <Route /> -> 컴포넌트들을 화면에 띄워주는 역할 ex) <Route path="/login" component={LogIn} /> -> 경로가 "/login"일때 LogIn컴포넌트를 화면에 보여준다.
    - `exact` 속성을 사용하면 path의 값이 정확하게 일치해야 라우팅이 된다.
- ### SPA route
    - SPA에서는 url은 없고 index.html만 존재한다. (메인 주소만 존재한다.)
    - historyApi가 가짜로 url을 만들어 준다. (가짜 주소를 뒤에 입력을 해준다.)
    - 새로고침할 경우 url 주소는 서버로 전송된다. -> 서버는 메인 주소 url만 알고 다른 경오는 모른다. (ex localhost:8080만 알고 localhost:8080/login 등 뒤에 붙은 path는 모름)
    - 즉 어떤 path를 입력하든 메인 페이지(index.html)로 가게된다.
    - webpack devServer에서 historyApiFallback: true,로 설정해주면  devServer가 가짜주소(메인 주소 뒤에 붙는 /login, /signup 등등)를 있는 주소처럼 적용하게 해준다.
- ### 코드 스플리팅
    - SPA의 경우 페이지 수가 많아 지면 (js파일의 용량이 커진다) 화면 로딩 시간이 길어져 UX가 안좋아 질 수 있다. 그럴경우 코드스플리팅을 사용한다.
    - 코드 스플리팅을 하게 되면, 지금 당장 필요한 코드가 아니라면 따로 분리시켜서, 나중에 필요할때 불러와서 사용 할 수 있습니다. 이를 통하여, 페이지의 로딩 속도를 개선 할 수 있다.
    - 코드 스플리팅으로 당장 필요한 컴포넌트가 아닌 경우 불러오지 않고, 필요한 컴포넌트는 그때그때 불러온다.
    - 어떤식으로 분리하나? -> 페이지 별로 분리 한다(페이지 단위로 적용한다.) 예를 들어 login페이지에서는 signup 페이지를 불러올 필요가 없다. / SSR과 SSR이 필요없는 컴포넌트를 분리한다. (서버 영역에서 용량 감소)
    - `@loadable/component` 라이브러리를 사용해서 코드 스플리팅 해준다. (ex const LogIn = loadable(() => import('@pages/LogIn'));)
    - 꼭 Router(App.tsx)에서만 하는 것이 아닌 모든 컴포넌트에서 가능하다.
- ### css-in-js(styled-components대신 emotion 사용)
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
- ### React
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
    - 개명하기
        ```js
            //import 구문에서는 as 키워드로 개명을 할 수 있다.
            import {Redirect as rd} from 'react-router';
            // 변수 선언 & 구조분해할당시 변수명을 :(콜론)을 사용해 개명해서 사용할 수 있다.
            const {data: userData} = .....'
        ```
    - useParams() hook으로 route의 params객체에 접근이 가능하다.
    - 에러가 발생했을 때 console.dir(error); 로 에러를 잡는다.
- ### Typescript
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
        - 기본적으로 변수, 매개변수, 리턴값에 타입을 붙여주면 됨.
        - 남이 타이핑해둔 것 분석하는 게 어려움
        - Go to Type Definition
        - 자바스크립트 라이브러리 작성자와는 다른 사람이 만든 ts 라이브러리가 @types로 시작하는 것들
    - 타입스크립트를 사용하는 경우 컴포넌트에 전달된 props에 대한 타입을 직접 정의해줘야 한다.
        ```js
            interface Props {
                show: boolean;
                onCloseModal: () => void;
                style: CSSProperties;
                closeButton?: boolean;
            }
        ```
    - 타입스크립트에서 빈 객체나 빈 배열의 경우 타입을 지정해 줘야 한다. 
- ### Javascript
    - axios.post('url', {보낼 data}).then(() => {요청이 성공했을 경우}).catch((error) => {요청이 실패했을 경우}).finally(() => { 무조건(성공했든 실패했든) 실행되는 코드 -> 성공하든 실패하든 공통적으로 처리할 로직을 여기에 작성해 준다. }) ->  `.then.catch`, `try{}....catch{}`문 둘다에 finally생김
    - 정확한 에러구문은 error.response에 담겨있다.
    - 타입스크립트는 오타가 발생할 경우 에러표시가 나지만 자바스크립트는 오타가 발생해도 에러표시가 안되는 경우도 있다. 따라서 자바스크립트는 eslint를 사용해야 오타를 잡을 수 있다.
- ### SWR (react-query, GraphQL-Apollo 같은 기능을 한다. 취향에 따라 선택)
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
    - SWR은 조건부 요청을 지원한다. 
        - `userData ? `/api/workspaces/${workspace}/channels` : null,`
        - 로그인 했을 때만 채널을 보여주고 아닌 경우 null
- ### 워크스페이스 만들기 챕터
    - 그라바타(gravatar)
        - [gravatar홈페이지](https://ko.gravatar.com/)
        - 랜덤한 이미지를 만들어 주는 서비스
        - 프로필 사진이 없는 사용자에게 랜덤한 이미지를 제공해 줄 경우 유용하게 사용된다.
        - 계속 랜덤한 이미지를 생성하는 것이 아닌 이메일 별로 1:1 매칭을 해줘서 한 이메일에 하나의 이미지를 계속해서 사용
        - `npm i gravatar @types/gravatar`
    - 중첩 라우터
        - Channel이랑 DM은 레이아웃으로 워크스페이스를 사용한다.
        - 페이지 레이아웃을 정하는 방법
            - 첫 번째 : 각각의 pages 컴포넌트에서 layout 컴포넌트로 감싸고 layout 컴포넌트에서 {children} Props로 받아오는 방법 
            - 두 번째 : layout 컴포넌트 자체에서 children을 판단 하는 방법 ->  route주소가 계층구조여야 사용 가능한 방법
        - 메인 라우터(App > index.tsx)에서 workspace만 등록을 하고, workspace컴포넌트에서 router로 또 나눠준다. (라우터의 중첩이 가능하다.)
        - Switch>Route 안에 Switch>Route 즉, 중첩 라우터 구조에서 중요한 점은 주소의 구조가 동일해야 한다.
        - Pages > Channel이랑 DM 컴포넌트에서 각각 Layouts > <Workspace></Workspace>로 감싸주거나 
        - Pages > Channel이랑 DM 컴포넌트에서 각각 Layouts > <Workspace></Workspace>로 감싸지 않고 Workspace 컴포넌트에서 또 다시 라우터를 사용해서 어떤 컴포넌트를 사용할지 판단해준다. 
        - 어떤 방법을 사용할지 정하는 방법
            - 주소가 일관성이 있다면(계층 구조이면) 두 번째 방법 사용
            - 주소가 계층적이지 않다면 첫 번째 방법 사용
    - 메뉴 & 모달 구현
        -  한 번 클릭 했을 때 활성화되고 다시 클릭하면 비활성화 되는 것을 토글 함수라 한다. (과거 값을 반전해 준다.)
        - onClickUserProfile함수를 통해서 프로필 아이콘을 클릭 했을 때 메뉴가 나타나게 한다.
        - component를 나누면 보통 component에 props를 전달한다.
        - 타입스크립트를 사용하는 경우 전달된 props에 대한 타입을 직접 정의해줘야 한다.
        - Props를 component의 타입에 제너릭으로 넣어준다.
        ```js
            interface Props {
                show: boolean;
                onCloseModal: () => void;
                style: CSSProperties;
                closeButton?: boolean;
            }

            const Menu: FC<Props> = ({show, style,onCloseModal,closeButton}) => {};
        ```
        - 메뉴 & 모달의 경우 자신을 제외한 바깥 영역을 클릭시 메뉴 & 모달이 닫혀야 한다.
            - 메뉴를 클릭시 메뉴의 기능을 하고 바깥 영역을 클릭시 메뉴가 닫힌다.
            - 즉, 자신이 클릭되면 본 기능을 수행하고 부모가 클릭되면 닫혀야 한다.
            - 부모태그에 메뉴가 닫히는 Click이벤트를 적용한다.
            - 자식(메뉴)태그에 Click이벤트로 stopPropagation적용해 준다.
            - html에서는 이벤트 버블링(자식태그에 발생한 이벤트가 부모 태그까지 전달되는 것)이 발생하는데 이러한 이벤트 버블링을 막아주는 역할을 stopPropagation이 해준다.
        - stopPropagation
            - 부모 태그로 이벤트 버블링 되는 것을 막아주는 기능을 한다.
            ```js
                const stopPropagation = useCallback((e) => {
                    e.stopPropagation();
                }, []);
            ```
        - Props의 기본 값을 설정하는 방법
        ```js
            // Menu부분에 해당 컴포넌트가 들어가면 된다.
            Menu.defaultProps = {
                closeButton: true,
            };
        ```
        - 이렇게 해주면 closeButton을 Props 설정을 따로 안 해줘도 항상 closeButton은 true로 적용된다.
        - WorkspaceButton = 워크스페이스 전환 버튼 
        - + = 워크스페이스 추가 버튼
        - 워크스페이스의 구성요소는 크게 2가지가 있다
            - 1. 워크스페이스에 표시되는 이름 (workspace-label)
            - 2. 주소에 표시되는 이름 (workspace-url-label)
        - !newWorkspace.trim() 까지 추가해 줘야 띄어쓰기까지 검사할 수 있다.
        - 에러가 발생하면 화면에 표시해 주는 라이브러리 사용 (일반 사용자는 개발자 도구를 잘 보지 않기 때문에 화면에 에러 문구를 표시 해 준다.)
            - `npm install react-toastify`
            - 에러가 발생하면 화면 아래에 에러 문구가 나타나고 몇 초 뒤에 사라진다.
        - input이 있는 컴포넌트는 따로 분리하는게 좋다
            - input창의 상태가 변경될 때마다 계속 리렌더링되기 때문이다.
    - 라우터 주소 설계
        - 라우터 주소에서 앞에 :(콜론)이 붙으면 그 부분은 사용자가 자유롭게 값을 바꿀 수 있는 부분 => 라우트 파라미터라 한다.
        ```js
            <Route path="/workspace/:workspace" component={Workspace} />
        ```
        - 파라미터가 아닌 형태의 주소를 파라미터 위에 작성해 줘야 한다.
        - useParams() hook을 사용해서 주소의 파라미터 자리에 있는 데이터에 접근이 가능하다.

- ### DM만들기 챕터
    - DM List
        - CollapseButton = 한 번 클릭을 하면 자식들이 사라졌다가 다시 한 번 클릭하면 자식들이 다시 나타나는 버튼  (`Collapse(메뉴 접기, 펴기)`)
        - CollapseButton의 i태그 className은 실제 슬랙의 className을 가져와 사용
        - 슬랙은 같은 이름의 사용자가 있을 수 있으므로 사용자 자신인 경우 nickname옆에 (나)표시가 있다.
        - NavLink 사용
            - NavLink는 activeClassName을 사용할 수 있다. (Link와 다른 점)
            - 지금 주소(현재 페이지의 주소)와 NavLink에서 설정한 주소와 같으면 activeClassName이 적용이 된다.
            - 내가 현재 클릭한 부분만 하이라이트 기능을 추가해 줄 때 유용하게 쓰인다. (예를 들어 Navbar에서 내가 클릭한 메뉴에만 하얀색으로 하이라이트 표시할 때)
    - DM & Channel List의 아이콘들(i태그 <i>)의 className은 슬랙의 html을 그대로 가져와 사용했다.
    - 로딩중 이거나 에러가 발생할 경우 화면 띄우지 않기
    - onKeydownChat 함수
        - enter키만 눌렀을 경우 채팅이 전송
        - shift + enter 키를 같이 누르면 줄바꿈
            - {e.key: "Enter", e.shiftkey: true }
        - console.log(e)를 출력해 보면 어떤 키를 눌렀는지 정보를 볼 수 있다.
            - 키 조합으로 다양한 기능도 추가 가능
            - metaKey => 윈도우 : 윈도우 키, 맥 : command 키 
    - autosize
        - `npm install autosize`
        - `npm install --save-dev @types/autosize`
        - 자동으로 입력창의 크기를 조절해준다(입력창에서 줄바꿈을 할경우 자동으로 입력창의 크기가 늘어난다.)
    - useRef
        - JavaScript에서는 DOM Selector(getElementById, querySelector 등) 함수를 사용해서 DOM 을 선택한다 
        - react에서 DOM에 직접 접근하려면 `ref`를 사용해야 한다.
        - `ref`를 사용 할 때에는 `useRef` hook을 사용한다.
        - `useRef()`를 사용해서 Ref객체를 만들고, 이 객체를 선택(다루고)하고 싶은 DOM에 `ref`값으로 설정, 그러면 Ref 객체의 `.current`값은 사용자가 원하는 DOM을 가르키게 된다.
        ```js
            const textareaRef = useRef();
            const onSubmitForm = () => {
                textareaRef.current.focus();
            }
            <Form onSubmit={onSubmitForm}>
                <Textarea ref={textareaRef} />
            </Form>
            //form에 데이터가 전송되고 나면 Textarea에 포커스된다.
        ```
- ### 실시간 채팅 + 각종 프론트 기술
    - #### soket.io hooks
        - WebSocket = 실시간으로 서버와 데이터를 서로 주고 받을 때 사용한다. (양방향)
        - `npm install socket.io-client@2` 설치 -> node.js 가장 유명한 라이브러리 (최신 버전은 3버전)
        - `npm install --save-dev @types/socket.io-client` -> @types도 같이 설치 해준다.
        - 2버전을 설치하는 이유 = backend로 nest.js typeorm을 사용하는데 nest.js typeorm이 socket.io-client 3버전을 완벽하게 지원하지 않는다.
        - socket.io는 전역적인 특징이 있어 하나의 컴포넌트에 연결했다가 다른 컴포넌트에 연결하면 연결이 끊어지는 상황이 발생할 수도 있다.
        - 위와 같은 상황을 방지하기 위해 hook 함수로 만들어서 공통되게 사용한다.
        - 사용법
            ```js
                import io from 'socket.io-client';

                const socket = io.connect(`url`);  //접속할 url을 입력해준다.
                socket.emit(event, data); //socket을 통해서 서버와 통신을 할 수 있고, emit('이벤트명', '데이터')을 사용해서 서버쪽에 이벤트명으로 데이터가 주어진 것이다.
                socket.on(event, () => {}); // on('이벤트명', '콜백함수) -> 서버에서 프론트쪽으로 전송된 이벤트명과 이벤트명에 해당하는 데이터를 받는 콜백함수를 입력한다.
                //emit()으로 서버에 데이터 보내고 on()으로 받아온다.
                socket.disconnect(); //연결해제
            ```
        - socket도 계층구조를 가진다.
            - namespace, room이 있다.
        - `useEffect`에서 socket.on()으로 데이터를 받았으면 `useEffect`의 `cleanup`함수(`useEffect`에 대한 뒷정리를 해준다.)에서 socket.off()를 해준다. (on, off는 짝꿍이다.)
            ```js
                useEffect(() => {
                    socket?.on('onlineList', (data: number[]) => {
                        setOnlineList(data);
                    });
                    return () => { //cleanup 함수
                        socket?.off('onlineList');
                    };
                }, [socket]);
            ```
            - `useEffect` 안에서 사용하는 상태나, props 가 있다면, `useEffect`의 `deps`에 넣어주어야 합니다. 그렇게 하는게, 규칙입니다. 만약 `useEffect`안에서 사용하는 상태나 props 를 `deps`에 넣지 않게 된다면 `useEffect`에 등록한 함수가 실행 될 때 최신 props / 상태를 가르키지 않게 됩니다.
        - socket 객체 중 connected, disconnected, receiveBuffer, sendBuffer을 주로 보면 된다.
            - connected: true 여야 연결이 성공된 것
            - disconnected: true이면 연결이 해제된 것
            - receiveBuffer 배열이 거의 항상 비어 있어야 한다.   (`receiveBuffer: []`)
            - socket.io는 sendBuffer에 데이터를 모았다가 연결이 되면 그동안에 있었던 데이터를 한 번에 다 전송한다. 
            - _callbacks에는 `socket.on()`했던 리스트들이 전부 들어 있다.
    - #### 커스텀 스크롤바, dayjs
        - 커스텀 스크롤바
            - `npm install react-custom-scrollbars --save` (설치)
            - `npm install -D @types/react-custom-scrollbars` (@types 설치)
            - autoHide = 가만히 있을 때 스크롤바가 사라졌다가 스크롤하면 다시 나타남
        - dayjs
            - 날짜 포맷 라이브러리
            - 불변성을 지키며 가벼운 라이브러리 (moment를 대신해서 dayjs를 사용하는 이유)
            - 불변성을 안 지키면 참조관계를 유지한다는 의미이다.
            - `npm install dayjs` (설치)
            - ex) `dayjs(data.createdAt).format('h:mm A')`
    - #### 멘션 기능 만들기
        - @멘션(mention)은 메시지에 특정 멤버를 지목하는 기능입니다. (해시태그 기능)
        - react-memtions 사용
        - `npm install react-memtions @types/react-memtions --save` (타입과 함께 설치해 준다.) 
        - 한 글자만 입력해도 입력한 단어가 들어가는 사용자 리스트를 보여준다. (자동완성 기능을 지원해 준다.)
        ```js
            import { Mention } from 'react-mentions';
            <Mention appendSpaceOnAdd trigger="@" data={} renderSuggestion={renderSuggestion} />
        ```
        - trigger="@" : @를 입력하면 멘션기능이 활성화 된다
        - appendSpaceOnAdd : 사용자를 추가 했을 때 커서가 스페이스 한 번된 위치에 있다.
        - data : id와 display 키를 갖는 객체들의 배열을 입력해 준다.
        - renderSuggestion : 추천 리스트를 어떻게 표시할지 (renderSuggestion함수를 직접 구현해 준다.)
    - #### 정규표현식 사용 문자열 변환
        - 문자열에서 어떤 특별한 패턴을 구현할 때는 정규표현식을 사용하는게 편하다. 
        - `npm install regexify-string` (정규표현식 라이브러리 설치)
        - `pattern: /@\[(.+?)]\((\d+?)\)|\n/g`  (프로젝트에서 사용한 정규 표현식 -> )
        - 정규표현식은 슬래시 사이에 표현식을 작성한다. /.../  (`/` 정규 표현식을 생성하고 있다는 것을 알려주는 것 - `/`로 감싸진 패턴을 적용한다)
        - 플래그
            - 정규 표현식엔 검색에 영향을 주는 플래그를 선택적으로 붙일 수 있다.
            - 자바 스크립트에서는 6개의 플래그를 지원한다. (자세한 내용은 [모던자바스크립트](https://ko.javascript.info/regexp-introduction)을 참고해 주세요)
            - i : i 플래그가 붙으면 대·소문자 구분 없이 검색 따라서 A와 a에 차이가 없다
            - g(global) : g 플래그가 붙으면 패턴과 일치하는 모든 것들을 찾는다. g 플래그가 없으면 패턴과 일치하는 첫 번째 결과만 반환 (모두 찾겠다는 의미)
            - m(multi line) : 다중 행 모드(multiline mode)를 활성화
            - s : .이 개행 문자 \n도 포함하도록 ‘dotall’ 모드를 활성화
            - u(unicode) : 유니코드 전체를 지원 이 플래그를 사용하면 서로게이트 쌍(surrogate pair)을 올바르게 처리할 수 있다. 
            - y(sticky) : 문자 내 특정 위치에서 검색을 진행하는 ‘sticky’ 모드를 활성화
        - 정규식 패턴(표현식)
            - 이 [사이트](https://heropy.blog/2018/10/28/regexp/)를 참고 했습니다. (HEROPY님의 개인 블로그)
            - \(이스케이프 문자) : 특수기호를 무력화 해주는 역할을 한다 (특수기호 앞에 웬만하면 붙여주는 것이 안전하다.)
            - \d : 숫자
            - + : 1개 이상 (최대한 많이 찾는다)  / +? (1개 이상이면서 최대한 적게 찾는다.)
            - ? : 0개나 1개
            - * : 0개 이상
            - | : or
            - \n : 줄 바꿈
    - #### 날짜별로 묶어 주기
        - 그룹화는 알고리즘!!
        - 방법
            - 1. 서버단에서 날짜별로 그룹화해서 프론트단에 데이터 보내주기 (서버에서 하는 연산 양은 적을 수록 좋다. 웬만하면 프론트단에서 작업하는게 좋음)
            - 2. 서버에서는 데이터를 그냥 보내주고 프론트단에서 작업한다.
        - `position : sticky` = 평소에는 일반 요소처럼 있다가 특정 높이가 되면 `fixed`처럼 바뀐다.
    - #### 리버스 인피니트 스크롤링(useSWRInfinite)
        - `forwardRef`  [공식문서](https://ko.reactjs.org/docs/react-api.html#reactforwardref)
        ```js
            const FancyButton = React.forwardRef((props, ref) => (
                <button ref={ref} className="FancyButton">
                    {props.children}
                </button>
            ));

            // DOM 버튼으로 ref를 직접 받을 수 있다.
            const ref = React.createRef();
            <FancyButton ref={ref}>Click me!</FancyButton>;
        ```
        - React 컴포넌트에서 ref를 props처럼 사용하려면 React에서 제공하는 `forwardRef()` 함수를 사용해야 한다. (ref는 prop로 다른 컴포넌트로 전달을 할 수 없다.)
        - 즉, 생성한 ref 객체를 다른 컴포넌트에 전달해 줄 때 `forwardRef()` 함수를 사용해야 한다. 
        - `props` 2 번째 자리에 ref를 받을 수 있다. (`props`다음에 `ref` 입력)
        - SWR이 인피니트 스크롤 전용 메서드를 제공해 준다.
            - `useSWRInfinite()` => 첫 번째 인자가 페이지 수(index)를 가지고 있는 함수가 된다.
            - `useSWR()`과는 다르게 첫 번째 인자가 함수여야 한다.
            ```js
                //useSWR
                const { data: myData } = useSWR(`/api/users`, fetcher);
                //useSWRInfinite
                const { data: chatData, mutate: mutateChat, revalidate, setSize } = useSWRInfinite<IDM[]>(
                    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,
                    fetcher,
                );
                //index = page 수 (타입이 number)
                //setSize = 페이지 수를 바꿔준다.
                //useSWRInfinite을 사용하면 이차원 배열이 반환된다.
            ```
        - 인피니트 스크롤링을 구현할 때 항상 같이 구현해 주면(선언해 주면) 좋은 데이터 2가지
            - isEmpty : 데이터가 비어있다
            - ex) `const isEmpty = chatData?.[0]?.length === 0;`
            - isReachingEnd : isEmpty가 true여도 끝에 도달한 것이 되고 isEmpty가 true는 아니지만 정해진 한 페이지 크기보다 남은 데이터가 적으면 끝에 도달한 것이 된다.
            - ex) `const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20)`
            - 이 프로젝트에서는 한 페이지에 최대 데이터를 20으로 정했다.
        - `flat()` 함수를 사용하면 이차원 배열을 일차원 배열로 만들 수 있다.
    - #### 스크롤바 조절하기
        - scrollbarRef.getScrollHeight() - values.scrollHeight
        - 커스텀 스크롤바의 높이에서 values객체의 스크롤 높이를 빼주면 현재 스크롤의 위치를 알 수 있다.
    - #### DM채팅하기
        - socket.io 추가해주기
        - socket으로 실시간으로 채팅 데이터를 서버에서 받아 오므로 `revalidate()`하지 않고 `mutate()`로 처리한다.
        - 150px이상 스크롤을 올렸을 때 상대방이 채팅을 입력해도 스크롤이 아래로 이동하면 안된다.
    - #### 채널 만들기
        - DM이랑 구조가 비슷하다
- ### 배포하기
    - bundle-analyzer
        - `npm install webpack-bundle-analyzer @types/webpack-bundle-analyzer --save`
        ```js
            //개발용
            if (isDevelopment && config.plugins) {
                config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: true }));
            }
            //배포용
            if (!isDevelopment && config.plugins) {
                config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
            }
            //개발용 배포용 따로 설정
        ```
        - front-end에서 webpack을 사용할 때는 꼭 설치를 해줘야 한다.
        - 용량을 확인할 수 있다.
        - tree-shaking : 쓸데 없는 (짜잘한) 파일들을 제거 (털어내는) 하는 기법 (사용하지 않는 코드를 제거하는 방식이다.)
            - 번들링 최적화를 위해서 사용된다.
            - 최적화를 할 파일(모듈 or 라이브러리 등)이 tree-shaking이 가능한지 확인한다.
            - ex) react-mentions tree-shaking -> 이런식으로 검색을 해 찾아본다.
        - 최종적으로 dist폴더의 파일들과 index.html 파일을 베포 하면 된다.
- ### 이미지 드래그 앤 드랍 기능 추가
    - DM & Channel components에 드래그 앤 드랍 기능 추가
    - onDrop, onDragOver 메서드 추가
    - onDragOver : 이미지를 클릭해서 드래그해서 끌고 있는 동안(손을 올려 놓고 있는 동안) 계속 호출되는 메서드
    - onDrop : 이미지 드래그에서 손을 떼는 순간 호출되는 메서드
    - onDrop, onDragOver 메서드가 들어 있는 부분이 드롭 존이 된다. 특정 영역에만 이미지를 드랍할 수 있게 하려면 두 메서드의 위치를 해당하는 특정 영역에 추개해 주면 된다.
    - [MDN문서](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop)소스코드 참고
    - 서버로 파일을 전송할 때는 `formData`를 주로 사용한다.
        - `const formData = new FormData();`

- ### 안 읽은 메시지 개수 표시
    - 안 읽은 메시지 개수를 표시하기 위해서 component분히
    - EachChannel, EachDm component생성해서 각각의 채널과 dm리스트를 분리했다.
- ### 기타
    - vscode에서 파일 이름을 선택하고 F12 키를 누르면 해당하는 파일이 열린다.
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
    - React component 분리 기준
        - 재사용 여부에 따라서 component로 분류할지를 정한다.
        - 재사용되는 부분은 component로 따로 분류해서 구현한다.
        - React 공식문서에서 "하나의 component는 하나의 역할만 한다." (단일책임원칙)라고 나와있다.
        - 위 기준을 토대로 component를 분리하는 것도 권장되고 있다.
    - if문, 반복문 안에 hooks있으면 에러 발생
    - return 아래에 hooks있으면 에러 발생
    - 프로젝트가 커질수록 JSX가 길어지고 컴포넌트 수도 많아진다 이럴 때 컴포넌트의 이름을 잘 지어야 한다 -> 이름이 길어지더라도 구별이 잘되게 이름을 작성한다. (이때 styled컴포넌트도 마찬가지로 이름을 잘 작성해야 한다.)
    - 함수 호출법
        ```js
            function Fn() {};

            Fn();
            Fn.call();
            Fn.apply();
            Fn``; //태그드 템플릿 리터럴 tagged template literal 백틱을 사용해서 함수를 호출하는 방법
        ```
    - 비효율적인 렌더링 해결하기
        - 컴포넌트 분리하기
        - react에서는 memo를 사용하여 말단 컴포넌트를 memo로 감싸준다.  (memo : props가 똑같으면 부모 컴포넌트가 바뀌어도 자식 컴포넌트를 리렌더링되지 않게 해준다.)
        - 값을 캐싱하는 부분에서는 useMemo() hook 사용 (hooks안에서 개별값을 캐싱하고 싶다면 useMemo()를 사용)
        - 최적화를 하기 위해서는 말단 컴포넌트에서 memo, useMemo()를 잘 사용해야 한다. 
    - 객체에 반복문을 사용할 때 `Object.entries()`사용 => 객체가 배열로 바뀐다 => `.map()`사용 가능