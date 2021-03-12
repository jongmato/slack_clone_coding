# 제로초 슬랙 클론 코딩 강의
Slack + React => sleact
icon, favicon 등은 슬랙에서 그대로 가져와 사용
css 슬랙 최대한 비슷하게 작성 
front : react, swr
back : nest.js typeorm, mysql

# 백그라운드 세팅

0. node 14버전(12나 15도 괜찮음)과 MySQL을 미리 설치하기
1. cd back
2. npm i
3. .env 작성하기(COOKIET_SECRET과 MYSQL_PASSWORD 본인 mysql 비밀번호 설정)
4. config/config.json 설정(MYSQL 접속 설정)
5. npx sequelize db:create(스키마 생성) - sleact db 생성됨
6. npm run dev했다가 ctrl + c로 끄기(테이블 생성)
7. npx sequelize db:seed:all(기초 데이터 넣기) - workspace, channel 기본 데이터 셍성 (슬랙의 구조는 workspace안에 channel이 존재하는 계층 구조)
8. npm run dev
9. localhost:3095에서 서버 돌아가는 중
10. 백엔드 개발자가 API.md와 typings/db.ts를 남겨둔 상황

# front 만들기

> 앞에 .이 붙은 획장자가 없는 파일은 숨긴 파일이다.(설정 파일)

## 공부한 내용
- npm rm lib -> 해당 패키지를 삭제할 수 있다.
- npm install @pmmmwh/react-refresh-webpack-plugin 명령어 실행시 오류가 발생한 경우 
- npm ERR! Fix the upstream dependency conflict, or retry | npm ERR! this command with --force, or --legacy-peer-deps
- 명령어 앞에 --force || --legacy-peer-deps 키워드를 붙여 준다 (ex npm install --force @pmmmwh/react-refresh-webpack-plugin)
- SPA에서는 url은 없고 index.html만 존재한다. (메인 주소만 존재한다.)
- historyApi가 가짜로 url을 만들어 준다. (가짜 주소를 뒤에 입력을 해준다.)
- 새로고침할 경우 url 주소는 서버로 전송된다. -> 서버는 메인 주소 url만 알고 다른 경오는 모른다. (ex localhost:8080만 알고 localhost:8080/login 등 뒤에 붙은 path는 모름)
- 즉 어떤 path를 입력하든 메인 페이지(index.html)로 가게된다.
- webpack devServer에서 historyApiFallback: true,로 설정해주면  devServer가 가짜주소(메인 주소 뒤에 붙는 /login, /signup 등등)를 있는 주소처럼 적용하게 해준다.
- SPA의 경우 페이지 수가 많아 지면 (js파일의 용량이 커진다) 화면 로딩 시간이 길어져 UX가 안좋아 질 수 있다. 그럴경우 코드스플리팅을 사용한다.
- 코드 스플리팅을 하게 되면, 지금 당장 필요한 코드가 아니라면 따로 분리시켜서, 나중에 필요할때 불러와서 사용 할 수 있습니다. 이를 통하여, 페이지의 로딩 속도를 개선 할 수 있다.
- 코드 스플리팅으로 당장 필요한 컴포넌트가 아닌 경우 불러오지 않고, 필요한 컴포넌트는 그때그때 불러온다.
- 어떤식으로 분리하나? -> 페이지 별로 분리 한다(페이지 단위로 적용한다.) 예를 들어 login페이지에서는 signup 페이지를 불러올 필요가 없다. / SSR과 SSR이 필요없는 컴포넌트를 분리한다. (서버 영역에서 용량 감소)
- @loadable/component 라이브러리를 사용해서 코드 스플리팅 해준다. (ex const LogIn = loadable(() => import('@pages/LogIn'));)
- @emotion/styled에서 styled.스타일을 적용할 태그를 입력 (const Header = styled.header`css작성` -> header태그 css를 작성한다는 의미)
- 이벤트 처리할 때 useCallback()을 사용해야 성능 최적화를 할 수 있다. (ex const onChangeEmail = useCallback( () => {}, []))

## history

1. 기초 세팅
    - npm init (초기설정)
    - npm i react react-dom (react 설치)
    - npm i typescript @types/react @types/react-dom (typescript 설치)
    - package-lock.json (패키지 마다 의존하는 버전이 다르므로 각각의 패키지가 의존하는 패키지의 정확한 버전을 표시해주는 역할을 한다.)
2. eslint 설정 (코드 검사 도구)
    - npm i -D eslint
    - .eslintrc(eslint 설정 파일 생성)
3. Prettier 설정 (코드 자동 정렬 도구)
    - prettier eslint 연결해 준다.
    - npm i -D prettier eslint-plugin-prettier eslint-config-prettier
    - .prettierrc (prettier 설정 파일 생성)
4. typescript 설정
    - tsconfig.json(타입스크립트 설정 파일 생성 )
    - 타입스크립트도 결국 자바스크립트로 변환된다.
    - 언어 문법과 자바스크립트로 어떻게 변환할지를 설정하는 파일
    - lib(라이브러리)은 ES2020(최신문법), DOM(브라우저) - front 개발시 설정
    - module은 esnext처럼 최신 설정이지만 target은 es5로 IE 브라우저에서도 돌아갈 수 있게 변환
    - strict: true를 켜놓아야 타입 체킹을 해줘서 의미가 있음.
5. 웹팩 설정
    - webpack.config.ts (웹팩 설정 파일 생성)
    - process.env.NODE_ENV !== 'production'; -> 배포용, process.env.NODE_ENV !== 'development'; -> 개발용
    - NODE_ENV, process.env는 백엔드(node)에서만 사용 가능하지만 new webpack.EnvironmentPlugin({}), 설정을 통해서 react에서도 접근가능하게 해준다.
    - entry(시작점) 메인 파일은 client.tsx 파일이다.
    - output (결과물) 출력 파일은 'dist'폴더가 생성되며 'dist'폴더안에 생성된다.
    - ts, css, json, 최신 문법 js 파일들을 하나로 합쳐줌.
    - npm i -D webpack @types/webpack @types/node
    - entry에서 파일을 선택하면 module에 정해진 rules대로 js로 변환하여 하나의 파일로 합쳐줌(output). plugins는 합치는 중 부가적인 효과를 줌
    - ts는 babel-loader로, css는 style-loader와 css-loader를 통해 js로 변환
    - babel에서는 @babel/preset-env(최신문법 변환) @babel/preset-react(리액트 jsx 변환), @babel/preset-typescript(타입스크립트 변환)
    - npm i -D css-loader style-loader @babel/core babel-loader @babel/preset-env @babel/preset-react @babel/preset-typescript
    - publicPath가 /dist/고 [name].js에서 [name]이 entry에 적힌대로 app으로 바뀌어 /dist/app.js가 결과물이 됨. ([name] -> entry에서 설정한 이름으로 생선된다.)
6. index.html 파일 생성
    - SPA 웹사이트를 제작할 때 index.html 파일은 매우 중요하다. (SEO, 성능최적화 등등)
    - 핵심 css index.html 파일에 설정해 준다. 
    - 아이콘, 폰트, 파비콘같은 것은 슬랙에서 그대로 사용
    - client.tsx에 간단한 tsx 작성
    - #app 태그에 리액트가 렌더링됨.
    - ./dist/app.js로 웹팩이 만들어낸 js파일 불러옴
7. tsconfig-for-webpack-config.json
    - webpack할 때 webpack.config.ts를 인식 못하는 문제
    - npm i cross-env
    - package.json의 scripts의 build를 cross-env TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack
    - npm run build
    - index.html 실행해보기
8. hot reloading 설정
    - npm i -D @pmmmwh/react-refresh-webpack-plugin react-refresh
    - webpack의 babel-loader 안에 설정(env) 및 plugin으로 추가
9. 웹팩 데브 서버 설치 (hot reloading 설정 하기 위해서 설치)
    - 개발용 서버인 devServer 옵션 추가(port는 3090, publicPath는 /dist/로)
    - webpack serve할 때 webpack.config.ts를 인식 못하는 문제
    - npm i -D ts-node webpack-dev-server @types/webpack-dev-server webpack-cli
    - package.json의 scripts의 dev를 cross-env TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack serve --env development
    - npm run dev하면 localhost:3090에서 서버 실행됨.
10. fork-ts-checker-webpack-plugin
    - webpack은 ts체크 후 eslint체크 후 빌드 시작
    - ts랑 eslint는 동시에 체크하면 더 효율적
    - 타입스크립트는 검사를 할때 블록킹(다음 동작을 막는다.)방식으로 검사를 진행한다. 이 lib는 이런한 타입스크립트 검사와 웹팩 검사를 동시에 진행하게 해준다.
11. 폴더 구조 세팅
    - 페이지들은 pages (서비스 페이지)
    - 페이지간 공통되는 틀은 layouts (공통 레이아웃)
    - 개별 컴포넌트는 components (짜잘한 컴포넌트들)
    - 커스텀훅은 hooks, 기타 함수는 utils 
    - 각 컴포넌트는 컴포넌트 폴더 아래 index.tsx(JSX)와 styles.tsx(스타일링)
12. ts와 webpack에서 alias 지정
    - npm i -D tsconfig-paths
    - tsconfig에서 baseUrl와 paths 설정
    - webpack에서는 resolve안에 alias 설정
    - ../layouts/App같은 것을 @layouts/App으로 접근 가능
    - import 경로를 절대 경로처럼 사용할 수 있도록 설정 
13. emotion 세팅
    - styled components와 비슷하지만 설정이 간단함.
    - SSR할 때 더 쉽게 할 수 있다.
    - npm i @emotion/react @emotion/styled
    - npm i -D @emotion/babel-plugin (웹팩에 babel 설정 추가)
    - 스타일드 컴포넌트로 만들 때 변수를 많이 만드는 셈이므로 & 같은 선택자 적극 활용해야 변수 이름짓기를 최소화할 수 있음.
14. @layouts/App 작성
    - 리액트 라우터 적용하기
    - npm i react-router react-router-dom
    - npm i -D @types/react-router @types/react-router-dom
    - client.tsx에서 App을 BrowserRouter로 감싸기
    - @layouts/App에 Switch, Redirect, Route 넣기
15. @loadable/component
    - 라우터를 코드스플리팅 해줌
    - 회원가입 페이지에 접근한 사람은 회원가입 페이지에 필요한 JS만 받음
    - 3초 룰 기억하자!(페이지 로딩 시간이 3초를 넘어가면 사용자들이 떠난다!!!)
    - npm i @loadable/component @types/loadable__component
16. @pages/SignUp 작성
17. 회원가입 axios로 진행
    - npm i axios
    - CORS 문제를 피하기 위해서 devServer에 proxy 세팅
    - CORS는 브라우저에서 다른 도메인의 서버로 요청을 보낼 때 발생
    - 같은 도메인의 서버로 요청을 보내거나, 서버끼리 요청을 보낼 때는 발생하지 않음
    - 따라서 같은 도메인인 proxy서버를 띄워 CORS를 피해갈 수 있음.
18. useInput 커스텀 훅 만들기
    - 커스텀 훅으로 훅들간에 중복된 것을 제거할 수 있음
    - 훅 내부에 훅을 작성할 수 있는 유일한 케이스
    - useCallback은 return 안에 들어있는 함수에 꼭 적용해주자
    - useMemo는 return 안에 들어있는 값에 적용하자
19. @pages/LogIn 작성 및 SWR
    - 로그인 한 사람이 회원가입/로그인 페이지에 접근한다면?
    - GET 요청은 SWR로 하는 것도 괜찮음
    - npm i swr
    - SWR에 fetcher(axios를 사용)를 달아줌.
    - 로그인했음을 증명하기 위해 withCredentials: true 잊으면 안 됨.
20. @layouts/Workspace 작성
    - 눈에 띄는 구역 단위로 스타일드컴포넌트로 만들어둠.
    - 구역 내부의 태그들은 스타일드컴포넌트로 만들면 변수명 지어야 하니 css선택자로 선택
21. 그라바타
    - npm i gravatar @types/gravatar
    - Github같은 아이콘을 만들 수 있음
22. typescript 정의
    - 기본적으로 변수, 매개변수, 리턴값에 타입을 붙여주면 됨.
    - 남이 타이핑해둔 것 분석하는 게 어려움
    - Go to Type Definition
    - 자바스크립트 라이브러리 작성자와는 다른 사람이 만든 ts 라이브러리가 @types로 시작하는 것들
23. @components/DMList 작성
    - 현재 채널 참여자 목록 가져오기
24. @pages/DirectMessage 작성
    - Header와 ChatList, ChatBox로 구성
25. @components/ChatBox 먼저 작성
    - react-mentions 활용
    - DM에서는 멘션 기능이 없지만 Channel에서는 있을 것
26. DM 보내보기
    - optimistic UI
    - 먼저 프론트에서 표시하고, 서버로는 그 다음에 요청보냄
    - 요청 실패하는 순간 프론트에서 제거하고 에러 메시지 띄움
    - 보낼 때 에러가난 것은 서버쪽에서 socket 연결 여부를 확인하기 때문
27. DM 로딩은 useSWRInfinite 사용
    - 결과물이 2차원 배열 꼴로 나옴.
    - 첫 번째 인자가 주소 문자열이 아닌 주소를 리턴하는 함수
    - 이 함수의 매개변수로 페이지가 들어있어서 현재 몇 페이지인지 알 수 있음.