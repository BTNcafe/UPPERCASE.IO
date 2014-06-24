VERSIONS
========
1.3.8 (2014. 6. 24)
- OOP 개선 (OOP-EXAMPLE 참고)
- 통신 버그 개선
- 에러 객체가 없을 때는 로그 표시 제한
- MODEL 설정에서 더 이상 propertyNamesForNewEvent 필요 없음
- create config에 데이터를 초기화하는 initData 기능 추가

1.3.7.2 (2014. 6. 20)
- MAIN(m, workerData, funcs)로 멀티코어 처리 가능 (funcs에는 다른 프로세스와 통신할 수 있는 on과 broadcast가 존재)
- 버그 개선
- 오류 발생시 로그 출력
- SERVER_CONFIG -> NODE_CONFIG로 변경
- DB.get 및 MODEL.get에 isRandom : true 로 random한 값을 가져올 수 있음

1.3.6 (2014. 6. 12)
- MODEL.getData, MODEL.findDat를 MODEL.get으로 통합
- MODEL.updateData -> MODEL.update, MODEL.removeData -> MODEL.remove, MODEL.findDataSet -> MODEL.find, MODEL.countDataSet -> MODEL.count로 변경
- MODEL.getDataWatching -> MODEL.getWatching, MODEL.findDataSetWatching -> MODEL.findWatching으로 변경
- DOM.children -> DOM.c, DOM.removeAllChildren -> DOM.empty로 변경

1.3.5 (2014. 5. 30)
- 멀티코어 지원
- findDataSet에서 sort를 지정하지 않으면 기본적으로 createTime 순으로 정렬되게 변경
- DB.getData, DB.findDat를 DB.get으로 통합
- DB.updateData -> DB.update, DB.removeData -> DB.remove, DB.findDataSet -> DB.find, DB.countDataSet -> DB.count로 변경

1.3.4 (2014. 5. 19)
- 데이터베이스에 데이터 저장 시 __RANDOM_KEY 자동 생성

1.3.3 (2014. 5. 13)
- UPPERCASE.JS 1.4 (https://bitbucket.org/uppercaseio/uppercase.js) 포함
- Windows 8 기반 태블릿 터치 대응
- CSS position: fixed를 지원하지 않는 브라우저에서는 시뮬레이션
- IE에서의 DOM.getLeft, DOM.getTop 버그 개선
- DOM.addAfterShowProc/DOM.addAfterRemoveProc를 DOM.addShowHandler/DOM.addRemoveHandler로 변경
- INFO.checkIsSupportFixed 제거, fixed 기능을 제공하지 않는 브라우저는 에뮬레이트
- INFO.checkIsSupportCanvas 제거, canvas를 제공하지 않는 IE8, 7, 6 버젼에서는 FlashCanvas로 대체
- UTIL/CALENDAR에서 파라미터가 없으면 현재 시각을 기준으로 작동되도록 변경
- BROWSER-UTIL/ANIMATE 기본 애니메이션 작동 시간 1초에서 0.5초로 변경

1.3.2
- EVENT에 double tap 이벤트 추가
- IE11 지원

1.3.1 (2014. 4. 20)
- 안드로이드 4.4 미만 버젼의 기본 웹 브라우저에서 통신 연결 오류 해결
- 멀티코어 지원 일시적으로 중단
- CONFIG.flashPolicyServerPort 기본 값 CONFIG.port + 1955로 설정
- INFO.getBrowserInfo, bowser( https://github.com/ded/bowser )에 의존하도록 변경

1.3 (2014. 4. 17)
- UPPERCASE에서 UPPERCASE.IO로 개명
- LOOP를 다시 COMMON으로 회귀, 성능 개선
- IE 5.5 ~ 8에서 backgroundSize cover/contain 스타일을 적용하는 기능 추가
- BROWSER/R_URI, BROWSER/RF_URI 제거
- COMMON/INTEGER, COMMON/REAL 추가
- UPPERCASE 부팅 후 명령어를 입력받을 수 있게 REPL(Read-Eval-Print-Loop)기능 추가(SERVER_CONFIG.isNotUsingREPL을 true로 두어 끌 수 있음)
- ANIMATE가 끝나면 최종 스타일이 DOM에 반영되도록 변경
- ANIMATE 기본 1초로 설정
- R/RF에 callback을 넘기면 AJAX처리 후 반환
- 폼에 입력중이면 새로고침 시 확인하여 새로고침을 방지할 수 있는 기능
- VIEW의 실제 경로를 구하는 HREF 기능 추가
- BOX 이름에 점(.)이 들어가도 인식되도록 개선
- REFRESH 기능 추가
- 실시간 처리 Redis 연동
- 멀티코어 CPU 지원으로 인한 성능 개선
- iOS/Mac Safari에서 캐시되지 않는 버그 해결
- 기본 BOX 폴더 내에 ERROR.html 파일을 만들면 서버에서 오류가 발생하거나 없는 리소스일 경우 해당 페이지가 출력되는 기능 추가
- 기본 BOX 폴더 내에 AUTHED.html 파일을 만들면 __AUTH로 인증 완료시 해당 페이지가 출력되는 기능 추가
- 기본 BOX 폴더 내에 favicon.ico 파일을 만들면 해당 파일이 파비콘으로 등록되는 기능 추가
- Flash Policy File을 제공하는 Server의 포트를 지정하는 CONFIG.flashPolicyServerPort 설정 추가
- isNotUsingREPL -> isUsingREPL로 변경

1.2.13.1 (2014. 3. 20)
- SERVER_CONFIG.isDBLogMode가 true일 때 DB Log 출력하도록 변경

1.2.13 (2014. 3. 17)
- meta description 기능 추가 (CONFIG.description으로 설정)
- 웹 이외의 타 플랫폼 공식 지원
- BROWSER_CONFIG isMobileFullScreen -> CONFIG로 이전
- isDevMode가 true일 때 DB 로그 출력
- createData와 createDataSafely가 createData로, updateData와 updateDataSafely가 updateData로, removeData와 removeDataSafely가 removeData로 통합

1.2.12 (2014. 3. 14)
- 1.2.11에서 업그레이드 시 반드시 MongoDB Shell에서 모든 컬렉션에 대해 다음 명령을 실행해 주시기 바랍니다. 컬렉션.update({\_isEnable : true}, { $set : {\__IS_ENABLED : true} }, false, true)
- IE8 호환성 보기 버튼 제거
- BROWSER_CONFIG isMobileFullScreen 설정 추가
- IE5.5 iepngfix_tilebg 버그 제거
- createValid, updateValid 없을 경우 발생하는 MODEL에서의 오류 해결

1.2.11 (2014. 3. 11)
- FIRE_ALL
- 기본 css에 overflow-scrolling: touch 설정 추가
- Form Submit Event 버그 개선
- COMMON/LOOP -> BROWSER/LOOP로 이전
- VALID each -> property, is -> equal로 변경

1.2.10 (2014. 3. 4)
- DELAY func에 delay를 pass
- MODEL getName
- datas -> dataSet으로 모두 변경
- 각 DOM마다 필요한 event를 on{Event Name}으로 설정할 수 있도록 (예: input은 onChagne, onKeydown, onKeyup 등)
- CHECK_IS_EMPTY_DATA 추가

1.2.9 (2014. 3. 2)
- CONNECTING(BROWSER_CONFIG.createConnectingPanel), DISCONNECTED(BROWSER_CONFIG.createDisconnectedPanel) 커스터마이징 기능 추가
- 브라우저 비호환 페이지 커스터마이징(BROWSER_CONFIG.createNotSupportBrowserVersionPanel) 기능 추가
- CONFIG 설정에서 OTHER_LANGS -> MULTI_LANG_SUPPORT
- 다중 언어 지원에서 원본 파일 제거 시 __UPPERCASE_COMPILED 파일도 제거
- OVERRIDE 함수 간소화
- CONFIG isNotUseDB -> isNotUsingDB, isNotRequireDBAuth -> isNotRequiringDBAuth
- VALID에서 Date 형 변환 버그 해결
- 연결이 끊어질 시 1초에 한번씩 다시 연결을 생성함

1.2.8 (2014. 2. 21)
- BROWSER_CONFIG에서 function을 완벽하게 passing하도록 개선
- 기본 스타일시트 간소화 및 개선
- 다른 언어 지원(OTHER_LANGS) 설정에서 js 파일도 가능하게 변경
- 다른 언어로 부팅할 시 해당 언어의 소스코드를 js 파일로 컴파일 후 __UPPERCASE_COMPILED 파일로 캐싱

1.2.7 (2014. 2. 18)
- MODEL에 onRemove 추가
- CONFIG isNotUsingDB -> isNotUseDB, isNotNeedDBAuth -> isNotRequireDBAuth, isSupportHD -> isSupportingHD
- BROWSER_CONFIG에 function을 포함할 수 있도록 개선

1.2.6 (2014. 2. 17)
- backgroundSize 추가
- tap event bubbling 버그 개선 
- childs (childDoms) -> children 변경
- js 압축 more

1.2.5 (2014. 2. 16)
- IE8의 IE7 모드에서 hashchange 이벤트가 발생하지 않는 문제 해결
- TH 및 TR에 colspan, rowspan 추가
- touch-callout, user-select 스타일 지원
- ANIMATE opacity 지원
- 다른 언어 지원 (OTHER_LANGS)
- Android/IE INFO.setLang 버그 해결

1.2.4.2 (2014. 2. 13)
- 기본 커넥션 접속 제한 시간 10초에서 5초로 단축
- LOOP 생성시 하나의 func만 넘어오면 interval로 지정

1.2.4 (2014. 2. 13)
- DOM 메모리 누수 해결
- DOM 제거시 Event 실행 중단
- Database API 변경
- 부팅 로그, 사용자 접속 로그 자동저장 기능 제거 (불필요한 부하)
- 데이터베이스를 사용하지 않을 경우 SERVER_CONFIG.isNotUsingDB = true 설정 추가

1.2.3 (2014. 2. 6)
- SOUND isLoop 추가
- SOUND stop 추가
- word-break 버그 제거
- DOM on 추가
- 모바일에서 mouseover/mouseout 지원

1.2.2 (2014. 1. 30)
- 링크 기본 색상을 #fff로 고정
- LAYER 크기 배율 버그 해결
- 안드로이드 2.x 버젼에서 overflow scroll 문제 해결
- 기본 스타일 변경

1.2.1 (2014. 1. 24)
- Android < 3 에서 overflow scroll 버그 해결 솔루션 제작
- MODEL에서 create시 특정 ROOM으로 broadcast하는 기능 제작
- match view에서 box name을 인식하는 버그 해결
- HD 화면에서 IMG load 이벤트가 두번 발생되는 버그 해결, width 두배로 인식되는 문제 해결
- LAYER_SCREEN 크기 배율 설정 기능 제작 
- DELAY 추가

1.2 (2014. 1)

1.1 (2013. 8)

1.0 (2013. 3)
- BTNcafe의 가상현실 SNS인 Bigtown의 소스코드로부터 Full-stack Framework 부분이 분리됨
