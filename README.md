# 제로초 슬랙 클론 코딩 강의
Slack + React => sleact

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

---

> 앞에 .이 붙은 획장자가 없는 파일은 숨긴 파일이다.(설정 파일)

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
