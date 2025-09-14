--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13
-- Dumped by pg_dump version 15.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: authors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authors (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    avatar character varying(255),
    bio text,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.authors OWNER TO postgres;

--
-- Name: authors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.authors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.authors_id_seq OWNER TO postgres;

--
-- Name: authors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.authors_id_seq OWNED BY public.authors.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: certificates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certificates (
    id integer NOT NULL,
    user_id integer,
    course_id integer,
    issued_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    certificate_url character varying(255)
);


ALTER TABLE public.certificates OWNER TO postgres;

--
-- Name: certificates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.certificates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.certificates_id_seq OWNER TO postgres;

--
-- Name: certificates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.certificates_id_seq OWNED BY public.certificates.id;


--
-- Name: course_favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_favorites (
    id integer NOT NULL,
    user_id integer,
    course_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.course_favorites OWNER TO postgres;

--
-- Name: course_favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.course_favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.course_favorites_id_seq OWNER TO postgres;

--
-- Name: course_favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.course_favorites_id_seq OWNED BY public.course_favorites.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    image_src character varying(255),
    price numeric(10,2) NOT NULL,
    bg character varying(50) DEFAULT 'white'::character varying,
    is_published boolean DEFAULT false,
    is_sales_leader boolean DEFAULT false,
    is_recorded boolean DEFAULT true,
    progress integer DEFAULT 0,
    module_count integer DEFAULT 0,
    lesson_count integer DEFAULT 0,
    total_duration integer DEFAULT 0,
    features text[],
    what_you_learn text[],
    author_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.courses_id_seq OWNER TO postgres;

--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enrollments (
    id integer NOT NULL,
    user_id integer,
    course_id integer,
    enrolled_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    completed_at timestamp without time zone,
    is_recorded boolean DEFAULT true
);


ALTER TABLE public.enrollments OWNER TO postgres;

--
-- Name: enrollments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.enrollments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.enrollments_id_seq OWNER TO postgres;

--
-- Name: enrollments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.enrollments_id_seq OWNED BY public.enrollments.id;


--
-- Name: lesson_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lesson_progress (
    id integer NOT NULL,
    user_id integer,
    lesson_id integer,
    completed boolean DEFAULT false,
    completed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.lesson_progress OWNER TO postgres;

--
-- Name: lesson_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lesson_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lesson_progress_id_seq OWNER TO postgres;

--
-- Name: lesson_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lesson_progress_id_seq OWNED BY public.lesson_progress.id;


--
-- Name: lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lessons (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text,
    video_url character varying(255),
    "order" integer NOT NULL,
    module_id integer,
    duration integer,
    image character varying(255),
    locked boolean DEFAULT false,
    lesson_type character varying(50) DEFAULT 'VIDEO'::character varying,
    test_id integer,
    url character varying(500),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.lessons OWNER TO postgres;

--
-- Name: lessons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lessons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lessons_id_seq OWNER TO postgres;

--
-- Name: lessons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lessons_id_seq OWNED BY public.lessons.id;


--
-- Name: modules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modules (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    "order" integer NOT NULL,
    course_id integer,
    lesson_count integer DEFAULT 0,
    assignment_count integer DEFAULT 0,
    total_duration integer DEFAULT 0,
    duration_weeks integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.modules OWNER TO postgres;

--
-- Name: modules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.modules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.modules_id_seq OWNER TO postgres;

--
-- Name: modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.modules_id_seq OWNED BY public.modules.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer,
    course_id integer,
    rating integer,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reviews_id_seq OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: test_attempts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test_attempts (
    id integer NOT NULL,
    user_id integer,
    test_id integer,
    score integer DEFAULT 0,
    percentage numeric(5,2) DEFAULT 0,
    passed boolean DEFAULT false,
    answers jsonb,
    completed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.test_attempts OWNER TO postgres;

--
-- Name: test_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.test_attempts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.test_attempts_id_seq OWNER TO postgres;

--
-- Name: test_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.test_attempts_id_seq OWNED BY public.test_attempts.id;


--
-- Name: test_questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test_questions (
    id integer NOT NULL,
    test_id integer,
    question_text text NOT NULL,
    question_type character varying(50) DEFAULT 'multiple_choice'::character varying,
    options jsonb,
    correct_answer character varying(255) NOT NULL,
    points integer DEFAULT 1,
    question_order integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.test_questions OWNER TO postgres;

--
-- Name: test_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.test_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.test_questions_id_seq OWNER TO postgres;

--
-- Name: test_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.test_questions_id_seq OWNED BY public.test_questions.id;


--
-- Name: tests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tests (
    id integer NOT NULL,
    lesson_id integer,
    title character varying(255) NOT NULL,
    description text,
    time_limit integer,
    passing_score integer DEFAULT 70,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tests OWNER TO postgres;

--
-- Name: tests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tests_id_seq OWNER TO postgres;

--
-- Name: tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tests_id_seq OWNED BY public.tests.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    name character varying(255),
    avatar character varying(255),
    role character varying(50) DEFAULT 'STUDENT'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: authors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authors ALTER COLUMN id SET DEFAULT nextval('public.authors_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: certificates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates ALTER COLUMN id SET DEFAULT nextval('public.certificates_id_seq'::regclass);


--
-- Name: course_favorites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_favorites ALTER COLUMN id SET DEFAULT nextval('public.course_favorites_id_seq'::regclass);


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: enrollments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments ALTER COLUMN id SET DEFAULT nextval('public.enrollments_id_seq'::regclass);


--
-- Name: lesson_progress id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress ALTER COLUMN id SET DEFAULT nextval('public.lesson_progress_id_seq'::regclass);


--
-- Name: lessons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons ALTER COLUMN id SET DEFAULT nextval('public.lessons_id_seq'::regclass);


--
-- Name: modules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules ALTER COLUMN id SET DEFAULT nextval('public.modules_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: test_attempts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_attempts ALTER COLUMN id SET DEFAULT nextval('public.test_attempts_id_seq'::regclass);


--
-- Name: test_questions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_questions ALTER COLUMN id SET DEFAULT nextval('public.test_questions_id_seq'::regclass);


--
-- Name: tests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tests ALTER COLUMN id SET DEFAULT nextval('public.tests_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: authors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.authors (id, name, avatar, bio, description, created_at, updated_at) FROM stdin;
1	Лана Б.	/avatars.png	Expert tax consultant with 10+ years of experience	\N	2025-09-14 12:46:40.466841	2025-09-14 12:46:40.466841
2	Лана Б.	/avatars.png	Expert tax consultant with 10+ years of experience	\N	2025-09-14 19:01:55.098733	2025-09-14 19:01:55.098733
3	Лана Б.	/avatars.png	Expert tax consultant with 10+ years of experience	\N	2025-09-14 19:02:49.585983	2025-09-14 19:02:49.585983
4	Лана Б.	/avatars.png	Expert tax consultant with 10+ years of experience	\N	2025-09-14 19:17:16.198632	2025-09-14 19:17:16.198632
5	Лана Б.	/avatars.png	Expert tax consultant with 10+ years of experience	\N	2025-09-14 19:18:15.381545	2025-09-14 19:18:15.381545
6	Лана Б.	/avatars.png	Expert tax consultant with 10+ years of experience	\N	2025-09-14 19:19:02.616762	2025-09-14 19:19:02.616762
7	Лана Б.	/avatars.png	Expert tax consultant with 10+ years of experience	\N	2025-09-14 19:27:32.720289	2025-09-14 19:27:32.720289
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: certificates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.certificates (id, user_id, course_id, issued_at, certificate_url) FROM stdin;
1	3	1	2025-09-14 19:03:32.343903	/certificates/3_1_1757876612343.pdf
\.


--
-- Data for Name: course_favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_favorites (id, user_id, course_id, created_at) FROM stdin;
1	3	1	2025-09-14 12:46:40.477751
2	3	3	2025-09-14 19:01:55.112416
3	3	5	2025-09-14 19:02:49.595544
4	3	7	2025-09-14 19:17:16.210732
5	3	9	2025-09-14 19:18:15.394236
6	3	11	2025-09-14 19:19:02.646431
7	3	13	2025-09-14 19:27:32.730382
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, title, description, image_src, price, bg, is_published, is_sales_leader, is_recorded, progress, module_count, lesson_count, total_duration, features, what_you_learn, author_id, created_at, updated_at) FROM stdin;
1	Основы налогообложения	Комплексный курс по основам налогообложения для начинающих. Изучите основные принципы, виды налогов и их применение в Казахстане.	/coursePlaceholder.png	25990.00	white	t	t	t	0	0	0	0	{"5 Модулей","78 видеоуроков","7 статей","10 ресурсов для скачивания","Полный пожизненный доступ","Сертификат об окончании"}	{"Понимание основных принципов налогообложения","Виды налогов и их применение","Налоговая отчетность и декларации","Практические примеры и кейсы"}	1	2025-09-14 12:46:40.468105	2025-09-14 12:46:40.468105
2	НДС для бизнеса	Подробный курс по НДС для предпринимателей и бухгалтеров. Практические примеры и актуальное законодательство.	/coursePlaceholder.png	35990.00	white	t	t	t	0	0	0	0	{"6 Модулей","95 видеоуроков","12 статей","15 ресурсов для скачивания","Полный пожизненный доступ","Сертификат об окончании"}	{"Основы НДС и его расчет","НДС в различных операциях","Налоговые вычеты и возмещение","Электронная отчетность по НДС"}	1	2025-09-14 12:46:40.469821	2025-09-14 12:46:40.469821
3	Основы налогообложения	Комплексный курс по основам налогообложения для начинающих. Изучите основные принципы, виды налогов и их применение в Казахстане.	/coursePlaceholder.png	25990.00	white	t	t	t	0	0	0	0	{"5 Модулей","78 видеоуроков","7 статей","10 ресурсов для скачивания","Полный пожизненный доступ","Сертификат об окончании"}	{"Понимание основных принципов налогообложения","Виды налогов и их применение","Налоговая отчетность и декларации","Практические примеры и кейсы"}	2	2025-09-14 19:01:55.099989	2025-09-14 19:01:55.099989
4	НДС для бизнеса	Подробный курс по НДС для предпринимателей и бухгалтеров. Практические примеры и актуальное законодательство.	/coursePlaceholder.png	35990.00	white	t	t	t	0	0	0	0	{"6 Модулей","95 видеоуроков","12 статей","15 ресурсов для скачивания","Полный пожизненный доступ","Сертификат об окончании"}	{"Основы НДС и его расчет","НДС в различных операциях","Налоговые вычеты и возмещение","Электронная отчетность по НДС"}	2	2025-09-14 19:01:55.102051	2025-09-14 19:01:55.102051
5	Основы налогообложения	Комплексный курс по основам налогообложения для начинающих. Изучите основные принципы, виды налогов и их применение в Казахстане.	/coursePlaceholder.png	25990.00	white	t	t	t	0	0	0	0	{"5 Модулей","78 видеоуроков","7 статей","10 ресурсов для скачивания","Полный пожизненный доступ","Сертификат об окончании"}	{"Понимание основных принципов налогообложения","Виды налогов и их применение","Налоговая отчетность и декларации","Практические примеры и кейсы"}	3	2025-09-14 19:02:49.586709	2025-09-14 19:02:49.586709
6	НДС для бизнеса	Подробный курс по НДС для предпринимателей и бухгалтеров. Практические примеры и актуальное законодательство.	/coursePlaceholder.png	35990.00	white	t	t	t	0	0	0	0	{"6 Модулей","95 видеоуроков","12 статей","15 ресурсов для скачивания","Полный пожизненный доступ","Сертификат об окончании"}	{"Основы НДС и его расчет","НДС в различных операциях","Налоговые вычеты и возмещение","Электронная отчетность по НДС"}	3	2025-09-14 19:02:49.587904	2025-09-14 19:02:49.587904
7	Основы налогообложения	Комплексный курс по основам налогообложения для начинающих. Изучите основные принципы, виды налогов и их применение в Казахстане.	/coursePlaceholder.png	25990.00	white	t	t	t	0	0	0	0	{"5 Модулей","78 видеоуроков","7 статей","10 ресурсов для скачивания","Полный пожизненный доступ","Сертификат об окончании"}	{"Понимание основных принципов налогообложения","Виды налогов и их применение","Налоговая отчетность и декларации","Практические примеры и кейсы"}	4	2025-09-14 19:17:16.199425	2025-09-14 19:17:16.199425
8	НДС для бизнеса	Подробный курс по НДС для предпринимателей и бухгалтеров. Практические примеры и актуальное законодательство.	/coursePlaceholder.png	35990.00	white	t	t	t	0	0	0	0	{"6 Модулей","95 видеоуроков","12 статей","15 ресурсов для скачивания","Полный пожизненный доступ","Сертификат об окончании"}	{"Основы НДС и его расчет","НДС в различных операциях","Налоговые вычеты и возмещение","Электронная отчетность по НДС"}	4	2025-09-14 19:17:16.201254	2025-09-14 19:17:16.201254
9	Основы налогообложения	Комплексный курс по основам налогообложения для начинающих. Изучите основные принципы, виды налогов и их применение в Казахстане.	/coursePlaceholder.png	25990.00	white	t	t	t	0	0	0	0	{"5 Модулей","78 видеоуроков","7 статей","10 ресурсов для скачивания","Полный пожизненный доступ","Сертификат об окончании"}	{"Понимание основных принципов налогообложения","Виды налогов и их применение","Налоговая отчетность и декларации","Практические примеры и кейсы"}	5	2025-09-14 19:18:15.38261	2025-09-14 19:18:15.38261
10	НДС для бизнеса	Подробный курс по НДС для предпринимателей и бухгалтеров. Практические примеры и актуальное законодательство.	/coursePlaceholder.png	35990.00	white	t	t	t	0	0	0	0	{"6 Модулей","95 видеоуроков","12 статей","15 ресурсов для скачивания","Полный пожизненный доступ","Сертификат об окончании"}	{"Основы НДС и его расчет","НДС в различных операциях","Налоговые вычеты и возмещение","Электронная отчетность по НДС"}	5	2025-09-14 19:18:15.383769	2025-09-14 19:18:15.383769
11	Основы налогообложения	Комплексный курс по основам налогообложения для начинающих. Изучите основные принципы, виды налогов и их применение в Казахстане.	/coursePlaceholder.png	25990.00	white	t	t	t	0	0	0	0	{"5 Модулей","78 видеоуроков","7 статей","10 ресурсов для скачивания","Полный пожизненный доступ","Сертификат об окончании"}	{"Понимание основных принципов налогообложения","Виды налогов и их применение","Налоговая отчетность и декларации","Практические примеры и кейсы"}	6	2025-09-14 19:19:02.619026	2025-09-14 19:19:02.619026
12	НДС для бизнеса	Подробный курс по НДС для предпринимателей и бухгалтеров. Практические примеры и актуальное законодательство.	/coursePlaceholder.png	35990.00	white	t	t	t	0	0	0	0	{"6 Модулей","95 видеоуроков","12 статей","15 ресурсов для скачивания","Полный пожизненный доступ","Сертификат об окончании"}	{"Основы НДС и его расчет","НДС в различных операциях","Налоговые вычеты и возмещение","Электронная отчетность по НДС"}	6	2025-09-14 19:19:02.622703	2025-09-14 19:19:02.622703
13	Основы налогообложения	Комплексный курс по основам налогообложения для начинающих. Изучите основные принципы, виды налогов и их применение в Казахстане.	/coursePlaceholder.png	25990.00	white	t	t	t	0	0	0	0	{"5 Модулей","78 видеоуроков","7 статей","10 ресурсов для скачивания","Полный пожизненный доступ","Сертификат об окончании"}	{"Понимание основных принципов налогообложения","Виды налогов и их применение","Налоговая отчетность и декларации","Практические примеры и кейсы"}	7	2025-09-14 19:27:32.721105	2025-09-14 19:27:32.721105
14	НДС для бизнеса	Подробный курс по НДС для предпринимателей и бухгалтеров. Практические примеры и актуальное законодательство.	/coursePlaceholder.png	35990.00	white	t	t	t	0	0	0	0	{"6 Модулей","95 видеоуроков","12 статей","15 ресурсов для скачивания","Полный пожизненный доступ","Сертификат об окончании"}	{"Основы НДС и его расчет","НДС в различных операциях","Налоговые вычеты и возмещение","Электронная отчетность по НДС"}	7	2025-09-14 19:27:32.722687	2025-09-14 19:27:32.722687
\.


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollments (id, user_id, course_id, enrolled_at, completed_at, is_recorded) FROM stdin;
1	3	1	2025-09-14 12:46:40.476067	\N	t
2	3	3	2025-09-14 19:01:55.109629	\N	t
3	3	5	2025-09-14 19:02:49.594249	\N	t
4	3	7	2025-09-14 19:17:16.209363	\N	t
5	3	9	2025-09-14 19:18:15.392855	\N	t
6	3	11	2025-09-14 19:19:02.643779	\N	t
7	3	13	2025-09-14 19:27:32.72909	\N	t
\.


--
-- Data for Name: lesson_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lesson_progress (id, user_id, lesson_id, completed, completed_at, created_at, updated_at) FROM stdin;
1	3	1	t	2025-09-14 19:29:05.976727	2025-09-14 19:27:47.98781	2025-09-14 19:29:05.976727
3	3	2	t	2025-09-14 19:29:05.990983	2025-09-14 19:29:05.990983	2025-09-14 19:29:05.990983
4	3	3	t	2025-09-14 19:29:06.003431	2025-09-14 19:29:06.003431	2025-09-14 19:29:06.003431
\.


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lessons (id, title, content, video_url, "order", module_id, duration, image, locked, lesson_type, test_id, url, created_at, updated_at) FROM stdin;
1	Урок 1: Что такое налоги	В этом уроке мы изучим основные понятия налогообложения...	\N	1	1	15	\N	f	VIDEO	\N	\N	2025-09-14 12:46:40.471031	2025-09-14 12:46:40.471031
2	Урок 2: Функции налогов	Рассмотрим основные функции налогов в экономике...	\N	2	1	20	\N	f	VIDEO	\N	\N	2025-09-14 12:46:40.471581	2025-09-14 12:46:40.471581
3	Урок 3: Налоговая система РК	Изучим структуру налоговой системы Казахстана...	\N	3	1	25	\N	f	VIDEO	\N	\N	2025-09-14 12:46:40.471835	2025-09-14 12:46:40.471835
4	Урок 1: Прямые налоги	Изучим прямые налоги и их особенности...	\N	1	2	18	\N	f	VIDEO	\N	\N	2025-09-14 12:46:40.472064	2025-09-14 12:46:40.472064
5	Урок 2: Косвенные налоги	Рассмотрим косвенные налоги и их применение...	\N	2	2	22	\N	f	VIDEO	\N	\N	2025-09-14 12:46:40.472343	2025-09-14 12:46:40.472343
6	Урок 1: Понятие НДС	Введение в налог на добавленную стоимость...	\N	1	3	20	\N	f	VIDEO	\N	\N	2025-09-14 12:46:40.473097	2025-09-14 12:46:40.473097
7	Урок 2: Налоговая база НДС	Изучим налоговую базу для расчета НДС...	\N	2	3	25	\N	f	VIDEO	\N	\N	2025-09-14 12:46:40.473364	2025-09-14 12:46:40.473364
8	Урок 1: Формула расчета НДС	Практические примеры расчета НДС...	\N	1	4	30	\N	f	VIDEO	\N	\N	2025-09-14 12:46:40.473576	2025-09-14 12:46:40.473576
9	Урок 1: Что такое налоги	В этом уроке мы изучим основные понятия налогообложения...	\N	1	5	15	\N	f	VIDEO	\N	\N	2025-09-14 19:01:55.103252	2025-09-14 19:01:55.103252
10	Урок 2: Функции налогов	Рассмотрим основные функции налогов в экономике...	\N	2	5	20	\N	f	VIDEO	\N	\N	2025-09-14 19:01:55.104133	2025-09-14 19:01:55.104133
11	Урок 3: Налоговая система РК	Изучим структуру налоговой системы Казахстана...	\N	3	5	25	\N	f	VIDEO	\N	\N	2025-09-14 19:01:55.104374	2025-09-14 19:01:55.104374
12	Урок 1: Прямые налоги	Изучим прямые налоги и их особенности...	\N	1	6	18	\N	f	VIDEO	\N	\N	2025-09-14 19:01:55.104623	2025-09-14 19:01:55.104623
13	Урок 2: Косвенные налоги	Рассмотрим косвенные налоги и их применение...	\N	2	6	22	\N	f	VIDEO	\N	\N	2025-09-14 19:01:55.104849	2025-09-14 19:01:55.104849
14	Урок 1: Понятие НДС	Введение в налог на добавленную стоимость...	\N	1	7	20	\N	f	VIDEO	\N	\N	2025-09-14 19:01:55.105454	2025-09-14 19:01:55.105454
15	Урок 2: Налоговая база НДС	Изучим налоговую базу для расчета НДС...	\N	2	7	25	\N	f	VIDEO	\N	\N	2025-09-14 19:01:55.105675	2025-09-14 19:01:55.105675
16	Урок 1: Формула расчета НДС	Практические примеры расчета НДС...	\N	1	8	30	\N	f	VIDEO	\N	\N	2025-09-14 19:01:55.105924	2025-09-14 19:01:55.105924
17	Урок 1: Что такое налоги	В этом уроке мы изучим основные понятия налогообложения...	\N	1	9	15	\N	f	VIDEO	\N	\N	2025-09-14 19:02:49.589167	2025-09-14 19:02:49.589167
18	Урок 2: Функции налогов	Рассмотрим основные функции налогов в экономике...	\N	2	9	20	\N	f	VIDEO	\N	\N	2025-09-14 19:02:49.589732	2025-09-14 19:02:49.589732
19	Урок 3: Налоговая система РК	Изучим структуру налоговой системы Казахстана...	\N	3	9	25	\N	f	VIDEO	\N	\N	2025-09-14 19:02:49.589997	2025-09-14 19:02:49.589997
20	Урок 1: Прямые налоги	Изучим прямые налоги и их особенности...	\N	1	10	18	\N	f	VIDEO	\N	\N	2025-09-14 19:02:49.590238	2025-09-14 19:02:49.590238
21	Урок 2: Косвенные налоги	Рассмотрим косвенные налоги и их применение...	\N	2	10	22	\N	f	VIDEO	\N	\N	2025-09-14 19:02:49.590794	2025-09-14 19:02:49.590794
22	Урок 1: Понятие НДС	Введение в налог на добавленную стоимость...	\N	1	11	20	\N	f	VIDEO	\N	\N	2025-09-14 19:02:49.591526	2025-09-14 19:02:49.591526
23	Урок 2: Налоговая база НДС	Изучим налоговую базу для расчета НДС...	\N	2	11	25	\N	f	VIDEO	\N	\N	2025-09-14 19:02:49.591777	2025-09-14 19:02:49.591777
24	Урок 1: Формула расчета НДС	Практические примеры расчета НДС...	\N	1	12	30	\N	f	VIDEO	\N	\N	2025-09-14 19:02:49.592007	2025-09-14 19:02:49.592007
25	Урок 1: Что такое налоги	В этом уроке мы изучим основные понятия налогообложения...	\N	1	13	15	\N	f	VIDEO	\N	\N	2025-09-14 19:17:16.203493	2025-09-14 19:17:16.203493
26	Урок 2: Функции налогов	Рассмотрим основные функции налогов в экономике...	\N	2	13	20	\N	f	VIDEO	\N	\N	2025-09-14 19:17:16.204548	2025-09-14 19:17:16.204548
27	Урок 3: Налоговая система РК	Изучим структуру налоговой системы Казахстана...	\N	3	13	25	\N	f	VIDEO	\N	\N	2025-09-14 19:17:16.204811	2025-09-14 19:17:16.204811
28	Урок 1: Прямые налоги	Изучим прямые налоги и их особенности...	\N	1	14	18	\N	f	VIDEO	\N	\N	2025-09-14 19:17:16.205083	2025-09-14 19:17:16.205083
29	Урок 2: Косвенные налоги	Рассмотрим косвенные налоги и их применение...	\N	2	14	22	\N	f	VIDEO	\N	\N	2025-09-14 19:17:16.205296	2025-09-14 19:17:16.205296
30	Урок 1: Понятие НДС	Введение в налог на добавленную стоимость...	\N	1	15	20	\N	f	VIDEO	\N	\N	2025-09-14 19:17:16.206022	2025-09-14 19:17:16.206022
31	Урок 2: Налоговая база НДС	Изучим налоговую базу для расчета НДС...	\N	2	15	25	\N	f	VIDEO	\N	\N	2025-09-14 19:17:16.20629	2025-09-14 19:17:16.20629
32	Урок 1: Формула расчета НДС	Практические примеры расчета НДС...	\N	1	16	30	\N	f	VIDEO	\N	\N	2025-09-14 19:17:16.206502	2025-09-14 19:17:16.206502
33	Урок 1: Что такое налоги	В этом уроке мы изучим основные понятия налогообложения...	\N	1	17	15	\N	f	VIDEO	\N	\N	2025-09-14 19:18:15.386454	2025-09-14 19:18:15.386454
34	Урок 2: Функции налогов	Рассмотрим основные функции налогов в экономике...	\N	2	17	20	\N	f	VIDEO	\N	\N	2025-09-14 19:18:15.387047	2025-09-14 19:18:15.387047
35	Урок 3: Налоговая система РК	Изучим структуру налоговой системы Казахстана...	\N	3	17	25	\N	f	VIDEO	\N	\N	2025-09-14 19:18:15.387319	2025-09-14 19:18:15.387319
36	Урок 1: Прямые налоги	Изучим прямые налоги и их особенности...	\N	1	18	18	\N	f	VIDEO	\N	\N	2025-09-14 19:18:15.387848	2025-09-14 19:18:15.387848
37	Урок 2: Косвенные налоги	Рассмотрим косвенные налоги и их применение...	\N	2	18	22	\N	f	VIDEO	\N	\N	2025-09-14 19:18:15.388205	2025-09-14 19:18:15.388205
38	Урок 1: Понятие НДС	Введение в налог на добавленную стоимость...	\N	1	19	20	\N	f	VIDEO	\N	\N	2025-09-14 19:18:15.389147	2025-09-14 19:18:15.389147
39	Урок 2: Налоговая база НДС	Изучим налоговую базу для расчета НДС...	\N	2	19	25	\N	f	VIDEO	\N	\N	2025-09-14 19:18:15.389377	2025-09-14 19:18:15.389377
40	Урок 1: Формула расчета НДС	Практические примеры расчета НДС...	\N	1	20	30	\N	f	VIDEO	\N	\N	2025-09-14 19:18:15.389817	2025-09-14 19:18:15.389817
41	Урок 1: Что такое налоги	В этом уроке мы изучим основные понятия налогообложения...	\N	1	21	15	\N	f	VIDEO	\N	\N	2025-09-14 19:19:02.62711	2025-09-14 19:19:02.62711
42	Урок 2: Функции налогов	Рассмотрим основные функции налогов в экономике...	\N	2	21	20	\N	f	VIDEO	\N	\N	2025-09-14 19:19:02.628369	2025-09-14 19:19:02.628369
43	Урок 3: Налоговая система РК	Изучим структуру налоговой системы Казахстана...	\N	3	21	25	\N	f	VIDEO	\N	\N	2025-09-14 19:19:02.629546	2025-09-14 19:19:02.629546
44	Урок 1: Прямые налоги	Изучим прямые налоги и их особенности...	\N	1	22	18	\N	f	VIDEO	\N	\N	2025-09-14 19:19:02.631271	2025-09-14 19:19:02.631271
45	Урок 2: Косвенные налоги	Рассмотрим косвенные налоги и их применение...	\N	2	22	22	\N	f	VIDEO	\N	\N	2025-09-14 19:19:02.632554	2025-09-14 19:19:02.632554
46	Урок 1: Понятие НДС	Введение в налог на добавленную стоимость...	\N	1	23	20	\N	f	VIDEO	\N	\N	2025-09-14 19:19:02.635658	2025-09-14 19:19:02.635658
47	Урок 2: Налоговая база НДС	Изучим налоговую базу для расчета НДС...	\N	2	23	25	\N	f	VIDEO	\N	\N	2025-09-14 19:19:02.636279	2025-09-14 19:19:02.636279
48	Урок 1: Формула расчета НДС	Практические примеры расчета НДС...	\N	1	24	30	\N	f	VIDEO	\N	\N	2025-09-14 19:19:02.636662	2025-09-14 19:19:02.636662
49	Итоговый тест по основам налогообложения	Проверьте свои знания по всему курсу основ налогообложения	\N	4	1	30	\N	f	TEST	1	\N	2025-09-14 19:19:41.522996	2025-09-14 19:19:41.522996
50	Урок 1: Что такое налоги	В этом уроке мы изучим основные понятия налогообложения...	\N	1	25	15	\N	f	VIDEO	\N	\N	2025-09-14 19:27:32.724206	2025-09-14 19:27:32.724206
51	Урок 2: Функции налогов	Рассмотрим основные функции налогов в экономике...	\N	2	25	20	\N	f	VIDEO	\N	\N	2025-09-14 19:27:32.724867	2025-09-14 19:27:32.724867
52	Урок 3: Налоговая система РК	Изучим структуру налоговой системы Казахстана...	\N	3	25	25	\N	f	VIDEO	\N	\N	2025-09-14 19:27:32.725122	2025-09-14 19:27:32.725122
53	Урок 1: Прямые налоги	Изучим прямые налоги и их особенности...	\N	1	26	18	\N	f	VIDEO	\N	\N	2025-09-14 19:27:32.725349	2025-09-14 19:27:32.725349
54	Урок 2: Косвенные налоги	Рассмотрим косвенные налоги и их применение...	\N	2	26	22	\N	f	VIDEO	\N	\N	2025-09-14 19:27:32.725555	2025-09-14 19:27:32.725555
55	Урок 1: Понятие НДС	Введение в налог на добавленную стоимость...	\N	1	27	20	\N	f	VIDEO	\N	\N	2025-09-14 19:27:32.726221	2025-09-14 19:27:32.726221
56	Урок 2: Налоговая база НДС	Изучим налоговую базу для расчета НДС...	\N	2	27	25	\N	f	VIDEO	\N	\N	2025-09-14 19:27:32.726475	2025-09-14 19:27:32.726475
57	Урок 1: Формула расчета НДС	Практические примеры расчета НДС...	\N	1	28	30	\N	f	VIDEO	\N	\N	2025-09-14 19:27:32.726713	2025-09-14 19:27:32.726713
\.


--
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.modules (id, title, "order", course_id, lesson_count, assignment_count, total_duration, duration_weeks, created_at, updated_at) FROM stdin;
1	Модуль 1: Введение в налогообложение	1	1	0	0	0	1	2025-09-14 12:46:40.470185	2025-09-14 12:46:40.470185
2	Модуль 2: Виды налогов	2	1	0	0	0	1	2025-09-14 12:46:40.470656	2025-09-14 12:46:40.470656
3	Модуль 1: Основы НДС	1	2	0	0	0	1	2025-09-14 12:46:40.472618	2025-09-14 12:46:40.472618
4	Модуль 2: Расчет НДС	2	2	0	0	0	1	2025-09-14 12:46:40.472839	2025-09-14 12:46:40.472839
5	Модуль 1: Введение в налогообложение	1	3	0	0	0	1	2025-09-14 19:01:55.102354	2025-09-14 19:01:55.102354
6	Модуль 2: Виды налогов	2	3	0	0	0	1	2025-09-14 19:01:55.102936	2025-09-14 19:01:55.102936
7	Модуль 1: Основы НДС	1	4	0	0	0	1	2025-09-14 19:01:55.105046	2025-09-14 19:01:55.105046
8	Модуль 2: Расчет НДС	2	4	0	0	0	1	2025-09-14 19:01:55.105246	2025-09-14 19:01:55.105246
9	Модуль 1: Введение в налогообложение	1	5	0	0	0	1	2025-09-14 19:02:49.5882	2025-09-14 19:02:49.5882
10	Модуль 2: Виды налогов	2	5	0	0	0	1	2025-09-14 19:02:49.588789	2025-09-14 19:02:49.588789
11	Модуль 1: Основы НДС	1	6	0	0	0	1	2025-09-14 19:02:49.591067	2025-09-14 19:02:49.591067
12	Модуль 2: Расчет НДС	2	6	0	0	0	1	2025-09-14 19:02:49.591293	2025-09-14 19:02:49.591293
13	Модуль 1: Введение в налогообложение	1	7	0	0	0	1	2025-09-14 19:17:16.201721	2025-09-14 19:17:16.201721
14	Модуль 2: Виды налогов	2	7	0	0	0	1	2025-09-14 19:17:16.203095	2025-09-14 19:17:16.203095
15	Модуль 1: Основы НДС	1	8	0	0	0	1	2025-09-14 19:17:16.205492	2025-09-14 19:17:16.205492
16	Модуль 2: Расчет НДС	2	8	0	0	0	1	2025-09-14 19:17:16.205731	2025-09-14 19:17:16.205731
17	Модуль 1: Введение в налогообложение	1	9	0	0	0	1	2025-09-14 19:18:15.385429	2025-09-14 19:18:15.385429
18	Модуль 2: Виды налогов	2	9	0	0	0	1	2025-09-14 19:18:15.386061	2025-09-14 19:18:15.386061
19	Модуль 1: Основы НДС	1	10	0	0	0	1	2025-09-14 19:18:15.388634	2025-09-14 19:18:15.388634
20	Модуль 2: Расчет НДС	2	10	0	0	0	1	2025-09-14 19:18:15.388895	2025-09-14 19:18:15.388895
21	Модуль 1: Введение в налогообложение	1	11	0	0	0	1	2025-09-14 19:19:02.62344	2025-09-14 19:19:02.62344
22	Модуль 2: Виды налогов	2	11	0	0	0	1	2025-09-14 19:19:02.625103	2025-09-14 19:19:02.625103
23	Модуль 1: Основы НДС	1	12	0	0	0	1	2025-09-14 19:19:02.633445	2025-09-14 19:19:02.633445
24	Модуль 2: Расчет НДС	2	12	0	0	0	1	2025-09-14 19:19:02.634221	2025-09-14 19:19:02.634221
25	Модуль 1: Введение в налогообложение	1	13	0	0	0	1	2025-09-14 19:27:32.723111	2025-09-14 19:27:32.723111
26	Модуль 2: Виды налогов	2	13	0	0	0	1	2025-09-14 19:27:32.723817	2025-09-14 19:27:32.723817
27	Модуль 1: Основы НДС	1	14	0	0	0	1	2025-09-14 19:27:32.725799	2025-09-14 19:27:32.725799
28	Модуль 2: Расчет НДС	2	14	0	0	0	1	2025-09-14 19:27:32.726003	2025-09-14 19:27:32.726003
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, user_id, course_id, rating, comment, created_at, updated_at) FROM stdin;
1	3	1	5	Отличный курс! Очень понятно объясняют сложные темы.	2025-09-14 12:46:40.476655	2025-09-14 12:46:40.476655
2	3	2	4	Хороший курс по НДС, много практических примеров.	2025-09-14 12:46:40.477331	2025-09-14 12:46:40.477331
3	3	3	5	Отличный курс! Очень понятно объясняют сложные темы.	2025-09-14 19:01:55.111194	2025-09-14 19:01:55.111194
4	3	4	4	Хороший курс по НДС, много практических примеров.	2025-09-14 19:01:55.112168	2025-09-14 19:01:55.112168
5	3	5	5	Отличный курс! Очень понятно объясняют сложные темы.	2025-09-14 19:02:49.59478	2025-09-14 19:02:49.59478
6	3	6	4	Хороший курс по НДС, много практических примеров.	2025-09-14 19:02:49.595279	2025-09-14 19:02:49.595279
7	3	7	5	Отличный курс! Очень понятно объясняют сложные темы.	2025-09-14 19:17:16.209927	2025-09-14 19:17:16.209927
8	3	8	4	Хороший курс по НДС, много практических примеров.	2025-09-14 19:17:16.210439	2025-09-14 19:17:16.210439
9	3	9	5	Отличный курс! Очень понятно объясняют сложные темы.	2025-09-14 19:18:15.393441	2025-09-14 19:18:15.393441
10	3	10	4	Хороший курс по НДС, много практических примеров.	2025-09-14 19:18:15.394	2025-09-14 19:18:15.394
11	3	11	5	Отличный курс! Очень понятно объясняют сложные темы.	2025-09-14 19:19:02.644892	2025-09-14 19:19:02.644892
12	3	12	4	Хороший курс по НДС, много практических примеров.	2025-09-14 19:19:02.64597	2025-09-14 19:19:02.64597
13	3	13	5	Отличный курс! Очень понятно объясняют сложные темы.	2025-09-14 19:27:32.729646	2025-09-14 19:27:32.729646
14	3	14	4	Хороший курс по НДС, много практических примеров.	2025-09-14 19:27:32.730126	2025-09-14 19:27:32.730126
\.


--
-- Data for Name: test_attempts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.test_attempts (id, user_id, test_id, score, percentage, passed, answers, completed_at, created_at) FROM stdin;
1	3	1	12	100.00	t	[{"points": 2, "isCorrect": true, "questionId": 1, "userAnswer": "Б) Обязательный платеж", "correctAnswer": "Б) Обязательный платеж"}, {"points": 2, "isCorrect": true, "questionId": 2, "userAnswer": "Б) Фискальная", "correctAnswer": "Б) Фискальная"}, {"points": 3, "isCorrect": true, "questionId": 3, "userAnswer": "В) Физические и юридические лица", "correctAnswer": "В) Физические и юридические лица"}, {"points": 2, "isCorrect": true, "questionId": 4, "userAnswer": "Б) Министерство финансов", "correctAnswer": "Б) Министерство финансов"}, {"points": 3, "isCorrect": true, "questionId": 5, "userAnswer": "Г) Налоги зависят от способности платить", "correctAnswer": "Г) Налоги зависят от способности платить"}]	2025-09-14 19:03:53.170772	2025-09-14 19:03:53.170772
\.


--
-- Data for Name: test_questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.test_questions (id, test_id, question_text, question_type, options, correct_answer, points, question_order, created_at, updated_at) FROM stdin;
1	1	Что такое налог?	multiple_choice	["A) Добровольный взнос", "Б) Обязательный платеж", "В) Подарок государству", "Г) Благотворительность"]	Б) Обязательный платеж	2	1	2025-09-14 12:46:40.47441	2025-09-14 12:46:40.47441
2	1	Какая основная функция налогов?	multiple_choice	["A) Развлекательная", "Б) Фискальная", "В) Декоративная", "Г) Рекламная"]	Б) Фискальная	2	2	2025-09-14 12:46:40.475044	2025-09-14 12:46:40.475044
3	1	Кто является плательщиком налогов в РК?	multiple_choice	["A) Только физические лица", "Б) Только юридические лица", "В) Физические и юридические лица", "Г) Только иностранцы"]	В) Физические и юридические лица	3	3	2025-09-14 12:46:40.475433	2025-09-14 12:46:40.475433
4	1	Какой орган отвечает за налоговую политику в РК?	multiple_choice	["A) Министерство образования", "Б) Министерство финансов", "В) Министерство спорта", "Г) Министерство культуры"]	Б) Министерство финансов	2	4	2025-09-14 12:46:40.47566	2025-09-14 12:46:40.47566
5	1	Что означает принцип справедливости в налогообложении?	multiple_choice	["A) Все платят одинаково", "Б) Богатые платят больше", "В) Бедные не платят", "Г) Налоги зависят от способности платить"]	Г) Налоги зависят от способности платить	3	5	2025-09-14 12:46:40.475865	2025-09-14 12:46:40.475865
6	2	Что такое налог?	multiple_choice	["A) Добровольный взнос", "Б) Обязательный платеж", "В) Подарок государству", "Г) Благотворительность"]	Б) Обязательный платеж	2	1	2025-09-14 19:01:55.10726	2025-09-14 19:01:55.10726
7	2	Какая основная функция налогов?	multiple_choice	["A) Развлекательная", "Б) Фискальная", "В) Декоративная", "Г) Рекламная"]	Б) Фискальная	2	2	2025-09-14 19:01:55.108394	2025-09-14 19:01:55.108394
8	2	Кто является плательщиком налогов в РК?	multiple_choice	["A) Только физические лица", "Б) Только юридические лица", "В) Физические и юридические лица", "Г) Только иностранцы"]	В) Физические и юридические лица	3	3	2025-09-14 19:01:55.108674	2025-09-14 19:01:55.108674
9	2	Какой орган отвечает за налоговую политику в РК?	multiple_choice	["A) Министерство образования", "Б) Министерство финансов", "В) Министерство спорта", "Г) Министерство культуры"]	Б) Министерство финансов	2	4	2025-09-14 19:01:55.108958	2025-09-14 19:01:55.108958
10	2	Что означает принцип справедливости в налогообложении?	multiple_choice	["A) Все платят одинаково", "Б) Богатые платят больше", "В) Бедные не платят", "Г) Налоги зависят от способности платить"]	Г) Налоги зависят от способности платить	3	5	2025-09-14 19:01:55.109363	2025-09-14 19:01:55.109363
11	3	Что такое налог?	multiple_choice	["A) Добровольный взнос", "Б) Обязательный платеж", "В) Подарок государству", "Г) Благотворительность"]	Б) Обязательный платеж	2	1	2025-09-14 19:02:49.592766	2025-09-14 19:02:49.592766
12	3	Какая основная функция налогов?	multiple_choice	["A) Развлекательная", "Б) Фискальная", "В) Декоративная", "Г) Рекламная"]	Б) Фискальная	2	2	2025-09-14 19:02:49.593318	2025-09-14 19:02:49.593318
13	3	Кто является плательщиком налогов в РК?	multiple_choice	["A) Только физические лица", "Б) Только юридические лица", "В) Физические и юридические лица", "Г) Только иностранцы"]	В) Физические и юридические лица	3	3	2025-09-14 19:02:49.593541	2025-09-14 19:02:49.593541
14	3	Какой орган отвечает за налоговую политику в РК?	multiple_choice	["A) Министерство образования", "Б) Министерство финансов", "В) Министерство спорта", "Г) Министерство культуры"]	Б) Министерство финансов	2	4	2025-09-14 19:02:49.593804	2025-09-14 19:02:49.593804
15	3	Что означает принцип справедливости в налогообложении?	multiple_choice	["A) Все платят одинаково", "Б) Богатые платят больше", "В) Бедные не платят", "Г) Налоги зависят от способности платить"]	Г) Налоги зависят от способности платить	3	5	2025-09-14 19:02:49.594036	2025-09-14 19:02:49.594036
16	4	Что такое налог?	multiple_choice	["A) Добровольный взнос", "Б) Обязательный платеж", "В) Подарок государству", "Г) Благотворительность"]	Б) Обязательный платеж	2	1	2025-09-14 19:17:16.207718	2025-09-14 19:17:16.207718
17	4	Какая основная функция налогов?	multiple_choice	["A) Развлекательная", "Б) Фискальная", "В) Декоративная", "Г) Рекламная"]	Б) Фискальная	2	2	2025-09-14 19:17:16.208501	2025-09-14 19:17:16.208501
18	4	Кто является плательщиком налогов в РК?	multiple_choice	["A) Только физические лица", "Б) Только юридические лица", "В) Физические и юридические лица", "Г) Только иностранцы"]	В) Физические и юридические лица	3	3	2025-09-14 19:17:16.208726	2025-09-14 19:17:16.208726
19	4	Какой орган отвечает за налоговую политику в РК?	multiple_choice	["A) Министерство образования", "Б) Министерство финансов", "В) Министерство спорта", "Г) Министерство культуры"]	Б) Министерство финансов	2	4	2025-09-14 19:17:16.208963	2025-09-14 19:17:16.208963
20	4	Что означает принцип справедливости в налогообложении?	multiple_choice	["A) Все платят одинаково", "Б) Богатые платят больше", "В) Бедные не платят", "Г) Налоги зависят от способности платить"]	Г) Налоги зависят от способности платить	3	5	2025-09-14 19:17:16.209175	2025-09-14 19:17:16.209175
21	5	Что такое налог?	multiple_choice	["A) Добровольный взнос", "Б) Обязательный платеж", "В) Подарок государству", "Г) Благотворительность"]	Б) Обязательный платеж	2	1	2025-09-14 19:18:15.391241	2025-09-14 19:18:15.391241
22	5	Какая основная функция налогов?	multiple_choice	["A) Развлекательная", "Б) Фискальная", "В) Декоративная", "Г) Рекламная"]	Б) Фискальная	2	2	2025-09-14 19:18:15.391813	2025-09-14 19:18:15.391813
23	5	Кто является плательщиком налогов в РК?	multiple_choice	["A) Только физические лица", "Б) Только юридические лица", "В) Физические и юридические лица", "Г) Только иностранцы"]	В) Физические и юридические лица	3	3	2025-09-14 19:18:15.392158	2025-09-14 19:18:15.392158
24	5	Какой орган отвечает за налоговую политику в РК?	multiple_choice	["A) Министерство образования", "Б) Министерство финансов", "В) Министерство спорта", "Г) Министерство культуры"]	Б) Министерство финансов	2	4	2025-09-14 19:18:15.392413	2025-09-14 19:18:15.392413
25	5	Что означает принцип справедливости в налогообложении?	multiple_choice	["A) Все платят одинаково", "Б) Богатые платят больше", "В) Бедные не платят", "Г) Налоги зависят от способности платить"]	Г) Налоги зависят от способности платить	3	5	2025-09-14 19:18:15.392668	2025-09-14 19:18:15.392668
26	6	Что такое налог?	multiple_choice	["A) Добровольный взнос", "Б) Обязательный платеж", "В) Подарок государству", "Г) Благотворительность"]	Б) Обязательный платеж	2	1	2025-09-14 19:19:02.63909	2025-09-14 19:19:02.63909
27	6	Какая основная функция налогов?	multiple_choice	["A) Развлекательная", "Б) Фискальная", "В) Декоративная", "Г) Рекламная"]	Б) Фискальная	2	2	2025-09-14 19:19:02.641024	2025-09-14 19:19:02.641024
28	6	Кто является плательщиком налогов в РК?	multiple_choice	["A) Только физические лица", "Б) Только юридические лица", "В) Физические и юридические лица", "Г) Только иностранцы"]	В) Физические и юридические лица	3	3	2025-09-14 19:19:02.641769	2025-09-14 19:19:02.641769
29	6	Какой орган отвечает за налоговую политику в РК?	multiple_choice	["A) Министерство образования", "Б) Министерство финансов", "В) Министерство спорта", "Г) Министерство культуры"]	Б) Министерство финансов	2	4	2025-09-14 19:19:02.64228	2025-09-14 19:19:02.64228
30	6	Что означает принцип справедливости в налогообложении?	multiple_choice	["A) Все платят одинаково", "Б) Богатые платят больше", "В) Бедные не платят", "Г) Налоги зависят от способности платить"]	Г) Налоги зависят от способности платить	3	5	2025-09-14 19:19:02.642917	2025-09-14 19:19:02.642917
31	7	Что такое налог?	multiple_choice	["A) Добровольный взнос", "Б) Обязательный платеж", "В) Подарок государству", "Г) Благотворительность"]	Б) Обязательный платеж	2	1	2025-09-14 19:27:32.727686	2025-09-14 19:27:32.727686
32	7	Какая основная функция налогов?	multiple_choice	["A) Развлекательная", "Б) Фискальная", "В) Декоративная", "Г) Рекламная"]	Б) Фискальная	2	2	2025-09-14 19:27:32.728249	2025-09-14 19:27:32.728249
33	7	Кто является плательщиком налогов в РК?	multiple_choice	["A) Только физические лица", "Б) Только юридические лица", "В) Физические и юридические лица", "Г) Только иностранцы"]	В) Физические и юридические лица	3	3	2025-09-14 19:27:32.728456	2025-09-14 19:27:32.728456
34	7	Какой орган отвечает за налоговую политику в РК?	multiple_choice	["A) Министерство образования", "Б) Министерство финансов", "В) Министерство спорта", "Г) Министерство культуры"]	Б) Министерство финансов	2	4	2025-09-14 19:27:32.72871	2025-09-14 19:27:32.72871
35	7	Что означает принцип справедливости в налогообложении?	multiple_choice	["A) Все платят одинаково", "Б) Богатые платят больше", "В) Бедные не платят", "Г) Налоги зависят от способности платить"]	Г) Налоги зависят от способности платить	3	5	2025-09-14 19:27:32.728906	2025-09-14 19:27:32.728906
\.


--
-- Data for Name: tests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tests (id, lesson_id, title, description, time_limit, passing_score, created_at, updated_at) FROM stdin;
1	3	Тест по основам налогообложения	Проверьте свои знания по основам налогообложения	30	70	2025-09-14 12:46:40.473772	2025-09-14 12:46:40.473772
2	11	Тест по основам налогообложения	Проверьте свои знания по основам налогообложения	30	70	2025-09-14 19:01:55.106132	2025-09-14 19:01:55.106132
3	19	Тест по основам налогообложения	Проверьте свои знания по основам налогообложения	30	70	2025-09-14 19:02:49.592236	2025-09-14 19:02:49.592236
4	27	Тест по основам налогообложения	Проверьте свои знания по основам налогообложения	30	70	2025-09-14 19:17:16.206748	2025-09-14 19:17:16.206748
5	35	Тест по основам налогообложения	Проверьте свои знания по основам налогообложения	30	70	2025-09-14 19:18:15.390679	2025-09-14 19:18:15.390679
6	43	Тест по основам налогообложения	Проверьте свои знания по основам налогообложения	30	70	2025-09-14 19:19:02.637155	2025-09-14 19:19:02.637155
7	52	Тест по основам налогообложения	Проверьте свои знания по основам налогообложения	30	70	2025-09-14 19:27:32.726958	2025-09-14 19:27:32.726958
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, name, avatar, role, created_at, updated_at) FROM stdin;
1	admin@taxbilim.com	$2a$10$pPDeFK7piyTjwVRpQ5XKO.ZCExYoMmmqxJZ16HtUbkriQ0jfQ8HXq	Admin User	\N	ADMIN	2025-09-14 12:46:40.329112	2025-09-14 12:46:40.329112
2	teacher@taxbilim.com	$2a$10$nlqvXIM6E.uqpnoGNM2we.PZDaFO.jYqpc8EW.FPpl9hQ075znvKq	Teacher User	\N	TEACHER	2025-09-14 12:46:40.397504	2025-09-14 12:46:40.397504
3	student@taxbilim.com	$2a$10$s81xRJyfsHNoIGP9bDTEQuz752bI0UfbbdPOZ/68WptW08sxyVPTG	Student User	\N	STUDENT	2025-09-14 12:46:40.465921	2025-09-14 12:46:40.465921
\.


--
-- Name: authors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.authors_id_seq', 7, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- Name: certificates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.certificates_id_seq', 1, true);


--
-- Name: course_favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.course_favorites_id_seq', 7, true);


--
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_id_seq', 14, true);


--
-- Name: enrollments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.enrollments_id_seq', 7, true);


--
-- Name: lesson_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lesson_progress_id_seq', 4, true);


--
-- Name: lessons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lessons_id_seq', 57, true);


--
-- Name: modules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.modules_id_seq', 28, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 14, true);


--
-- Name: test_attempts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.test_attempts_id_seq', 1, true);


--
-- Name: test_questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.test_questions_id_seq', 35, true);


--
-- Name: tests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tests_id_seq', 7, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 21, true);


--
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- Name: certificates certificates_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: course_favorites course_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_favorites
    ADD CONSTRAINT course_favorites_pkey PRIMARY KEY (id);


--
-- Name: course_favorites course_favorites_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_favorites
    ADD CONSTRAINT course_favorites_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: lesson_progress lesson_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_pkey PRIMARY KEY (id);


--
-- Name: lesson_progress lesson_progress_user_id_lesson_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_user_id_lesson_id_key UNIQUE (user_id, lesson_id);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: test_attempts test_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_attempts
    ADD CONSTRAINT test_attempts_pkey PRIMARY KEY (id);


--
-- Name: test_questions test_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_questions
    ADD CONSTRAINT test_questions_pkey PRIMARY KEY (id);


--
-- Name: tests tests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT tests_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_course_favorites_user_course; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_course_favorites_user_course ON public.course_favorites USING btree (user_id, course_id);


--
-- Name: idx_courses_published; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_courses_published ON public.courses USING btree (is_published);


--
-- Name: idx_enrollments_user_course; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_enrollments_user_course ON public.enrollments USING btree (user_id, course_id);


--
-- Name: idx_lesson_progress_user_lesson; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lesson_progress_user_lesson ON public.lesson_progress USING btree (user_id, lesson_id);


--
-- Name: idx_reviews_course; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_course ON public.reviews USING btree (course_id);


--
-- Name: idx_test_attempts_user_test; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_test_attempts_user_test ON public.test_attempts USING btree (user_id, test_id);


--
-- Name: idx_test_questions_test; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_test_questions_test ON public.test_questions USING btree (test_id);


--
-- Name: idx_tests_lesson; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tests_lesson ON public.tests USING btree (lesson_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: certificates certificates_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: certificates certificates_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: course_favorites course_favorites_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_favorites
    ADD CONSTRAINT course_favorites_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: course_favorites course_favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_favorites
    ADD CONSTRAINT course_favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: courses courses_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.authors(id) ON DELETE CASCADE;


--
-- Name: enrollments enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: enrollments enrollments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: lesson_progress lesson_progress_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: lesson_progress lesson_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: lessons lessons_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- Name: modules modules_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: test_attempts test_attempts_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_attempts
    ADD CONSTRAINT test_attempts_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id) ON DELETE CASCADE;


--
-- Name: test_attempts test_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_attempts
    ADD CONSTRAINT test_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: test_questions test_questions_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_questions
    ADD CONSTRAINT test_questions_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id) ON DELETE CASCADE;


--
-- Name: tests tests_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT tests_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

