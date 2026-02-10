# Service Context: CloudNote (SaaS)

## 1. 프로젝트 개요
**CloudNote**는 사용자의 아이디어를 클라우드에 안전하게 저장하고, 모든 기기에서 동기화할 수 있는 SaaS 기반의 메모 작성 플랫폼입니다. 사용자는 개인, 업무, 여행 등 다양한 카테고리로 노트를 관리할 수 있으며, 구독 요금제(Free, Pro, Team)에 따라 차등화된 기능을 제공받습니다.

## 2. 디자인 및 UI 사양 (Stitch 리소스 기반)
*   **디자인 테마**: 모던, 클린, 다크 모드 지원
*   **주요 색상**:
    *   Primary: `#137fec` (블루)
    *   Background (Light): `#f6f7f8`
    *   Background (Dark): `#101922`
    *   Surface (Dark): `#1a2530`
*   **타이포그래피**: Inter, Noto Sans KR (웹 폰트)
*   **아이콘**: Material Icons (Filled, Round, Outlined)

## 3. 주요 페이지 및 기능 명세

### 3.1. 랜딩 페이지 (`/`)
*   **목적**: 서비스 소개 및 사용자 유입 유도
*   **주요 섹션**:
    *   히어로 섹션: "당신의 생각을 클라우드에 정리하세요" 메세지 및 CTA.
    *   기능 소개: 데스크톱 동기화, 보안 등.
    *   가격 정책 요약: 베이직, 프로, 팀 요금제 카드.
    *   CTA(Call To Action): "무료로 시작하기".

### 3.2. 로그인/회원가입 (`/login`)
*   **기능**:
    *   이메일/비밀번호 기반 로그인 및 회원가입.
    *   소셜 로그인 (Google, Apple) 지원.
    *   로그인/회원가입 모드 전환 탭.
*   **UI 특징**: 글래스모피즘 효과가 적용된 중앙 정렬 폼.

### 3.3. 대시보드 (`/dashboard`)
*   **목적**: 사용자 활동 요약 및 빠른 탐색.
*   **주요 데이터**:
    *   **통계**: 오늘의 메모 수, 클라우드 저장 용량 사용량(GB/MB).
    *   **구독 상태**: 현재 플랜(예: 프로), 갱신일 표시, 업그레이드 유도.
    *   **최근 활동**: 최근 수정된 노트, 공유된 노트 리스트.
    *   **저장된 메모**: 그리드 형태의 노트 카드 (카테고리 태그 포함: 업무, 개인, 아이디어 등).
*   **네비게이션**:
    *   데스크톱: 좌측 사이드바.
    *   모바일: 하단 탭 바 + 햄버거 메뉴(드로어).

### 3.4. 노트 작성/편집 (`/note`)
*   **기능**:
    *   제목 및 본문 작성 (Markdown 스타일).
    *   실시간 저장 (자동 저장).
    *   최근 노트 리스트 사이드바 제공 (빠른 전환).
    *   편집 툴바 (볼드, 이탤릭, 리스트, 이미지 등).
*   **UI 특징**: 글쓰기에 집중할 수 있는 미니멀한 에디터 인터페이스.

### 3.5. 구독 및 결제 (`/payment`, `/payment/success`)
*   **기능**:
    *   요금제 상세 비교 (무료 vs 프로).
    *   결제 주기 선택 (월간/연간).
    *   결제 진행 및 완료 확인 페이지.
    *   결제 성공 시 영수증 다운로드 및 대시보드 이동.

## 4. 데이터베이스 모델링 (Supabase Schema Proposal)

### 4.1. Users (`auth.users` 확장)
*   Supabase Auth와 연동되는 `public.profiles` 테이블.
*   **Fields**:
    *   `id` (UUID, PK, FK to auth.users)
    *   `email` (Text)
    *   `full_name` (Text)
    *   `avatar_url` (Text)
    *   `subscription_tier` (Enum: 'free', 'pro', 'team')
    *   `storage_used` (BigInt, bytes)
    *   `created_at` (Timestamptz)

### 4.2. Notes (`public.notes`)
*   사용자의 메모 데이터.
*   **Fields**:
    *   `id` (UUID, PK)
    *   `user_id` (UUID, FK to profiles.id)
    *   `title` (Text)
    *   `content` (Text/Markdown)
    *   `category` (Text, ex: 'Work', 'Personal')
    *   `tags` (Array of Text)
    *   `is_pinned` (Boolean)
    *   `last_edited_at` (Timestamptz)
    *   `created_at` (Timestamptz)

### 4.3. Subscriptions (`public.subscriptions`)
*   사용자의 등급 및 결제 상태 관리.
*   **Fields**:
    *   `id` (UUID, PK)
    *   `user_id` (UUID, FK to profiles.id)
    *   `status` (Enum: 'active', 'canceled', 'past_due')
    *   `plan_id` (Text)
    *   `current_period_start` (Timestamptz)
    *   `current_period_end` (Timestamptz)

## 5. 기술 스택
*   **Frontend**: Next.js 15+ (App Router), React, Tailwind CSS
*   **Backend & DB**: Supabase (PostgreSQL, Auth, Storage)
*   **Deployment**: Vercel (Recommended)
