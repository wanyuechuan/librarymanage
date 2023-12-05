//引入VueRouter
import { createRouter, createWebHistory } from "vue-router";
import Cookies from "js-cookie";

const routes = [{
        path: "/login",
        name: "login",
        component: () =>
            import ("@/views/LoginView.vue")
    },
    {
        path: "/register",
        name: "mbuhbnwnuiusvgd",
        component: () =>
            import ("@/views/RegisterView.vue")
    },
    {
        path: "/home",
        name: "jioadsuosjoiofvzcb",
        redirect: "/home/homePage",
        component: () =>
            import ("@/views/user/HomeView.vue"),
        children: [{
                path: "homePage",
                name: "homePage",
                component: () =>
                    import ("@/views/user/HomePageView.vue")
            }, {
                path: "user",
                name: "userManage",
                component: () =>
                    import ("@/views/user/UserView.vue")
            }, {
                path: "about",
                name: "about",
                component: () =>
                    import ("@/views/user/AboutView.vue"),
            }, {
                path: "admin",
                name: "admin",
                component: () =>
                    import ("@/views/admin/AdminView.vue"),
            },
            {
                path: "category",
                name: "category",
                component: () =>
                    import ("@/views/category/CateGoryView.vue"),
            },
            {
                path: "book",
                name: "book",
                component: () =>
                    import ("@/views/book/BookView.vue"),
            },


        ]
    }, {
        path: "/",
        redirect: "/home"
    },
    {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: () =>
            import ("@/views/404.vue"),
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})


router.beforeEach((to, from, next) => {
    if (to.path === "/login" || to.path === "/register") {
        return next();
    }
    const admin = Cookies.get("admin");
    if (!admin && to.path != "/login" && to.path != "/register") {
        return next("/login");
    }

    next();

})


export default router