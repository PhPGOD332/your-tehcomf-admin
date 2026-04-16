import { type RouteConfig, index, prefix, route, layout } from "@react-router/dev/routes";

export default [
    route('login', 'routes/login.tsx'),

    layout('routes/_auth.tsx', [
        route('home', "routes/home.tsx"),
        route('portfolio', 'routes/portfolio/layout.tsx', [
            index('routes/portfolio/_index.tsx'),
            route(':name', 'routes/portfolio/$work.tsx'),
            route('new', 'routes/portfolio/new.tsx')
        ]),
    ]),
] satisfies RouteConfig;
