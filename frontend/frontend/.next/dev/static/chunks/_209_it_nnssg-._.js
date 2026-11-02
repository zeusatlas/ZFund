(()=>{"use strict";(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/features/admin/ListToolbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ListToolbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
;
;
function ListToolbar({ search, onSearch, searchLabel, status, onStatus, statuses, extraControls }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-3 border-b border-navy/10 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full sm:max-w-xs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                        size: 16,
                        className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel"
                    }, void 0, false, {
                        fileName: "[project]/components/features/admin/ListToolbar.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: search,
                        onChange: (event)=>onSearch(event.target.value),
                        placeholder: searchLabel,
                        "aria-label": searchLabel,
                        className: "w-full rounded-lg border border-navy/15 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-gold"
                    }, void 0, false, {
                        fileName: "[project]/components/features/admin/ListToolbar.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/features/admin/ListToolbar.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: status,
                        onChange: (event)=>onStatus(event.target.value),
                        "aria-label": "Filter by status",
                        className: "rounded-lg border border-navy/15 bg-white px-3 py-2.5 text-sm text-steel outline-none focus:border-gold",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "All statuses"
                            }, void 0, false, {
                                fileName: "[project]/components/features/admin/ListToolbar.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, this),
                            statuses.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: item.value,
                                    children: item.label
                                }, item.value, false, {
                                    fileName: "[project]/components/features/admin/ListToolbar.tsx",
                                    lineNumber: 43,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/features/admin/ListToolbar.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    extraControls
                ]
            }, void 0, true, {
                fileName: "[project]/components/features/admin/ListToolbar.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/features/admin/ListToolbar.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_c = ListToolbar;
var _c;
__turbopack_context__.k.register(_c, "ListToolbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/features/admin/admin-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adminApiKeys",
    ()=>adminApiKeys,
    "adminRoot",
    ()=>adminRoot,
    "useActivity",
    ()=>useActivity,
    "useAddAdmin",
    ()=>useAddAdmin,
    "useAdmins",
    ()=>useAdmins,
    "useCampaign",
    ()=>useCampaign,
    "useCampaignContributions",
    ()=>useCampaignContributions,
    "useCampaigns",
    ()=>useCampaigns,
    "useCreateCampaignForHost",
    ()=>useCreateCampaignForHost,
    "useHostDetail",
    ()=>useHostDetail,
    "useHosts",
    ()=>useHosts,
    "useTransactions",
    ()=>useTransactions,
    "useUpdateCampaignStatus",
    ()=>useUpdateCampaignStatus,
    "useUpdateHostStatus",
    ()=>useUpdateHostStatus,
    "useUpdateWithdrawalStatus",
    ()=>useUpdateWithdrawalStatus,
    "useWithdrawals",
    ()=>useWithdrawals
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/client.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature(), _s10 = __turbopack_context__.k.signature(), _s11 = __turbopack_context__.k.signature(), _s12 = __turbopack_context__.k.signature(), _s13 = __turbopack_context__.k.signature();
"use client";
;
;
;
const adminRoot = [
    "admin"
];
const adminApiKeys = {
    hosts: (params)=>[
            ...adminRoot,
            "hosts",
            params
        ],
    host: (id)=>[
            ...adminRoot,
            "host",
            id
        ],
    transactions: (params)=>[
            ...adminRoot,
            "transactions",
            params
        ],
    activity: (page)=>[
            ...adminRoot,
            "activity",
            page
        ],
    campaigns: (params)=>[
            ...adminRoot,
            "campaigns",
            params
        ],
    campaign: (id)=>[
            ...adminRoot,
            "campaign",
            id
        ],
    contributions: (id, params)=>[
            ...adminRoot,
            "campaign",
            id,
            "contributions",
            params
        ],
    admins: ()=>[
            ...adminRoot,
            "admins"
        ],
    withdrawals: (params)=>[
            ...adminRoot,
            "withdrawals",
            params
        ]
};
const PAGE_LIMIT = 10;
async function list(path, { page, search, status, limit }) {
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(path, {
        params: {
            page,
            limit: limit ?? PAGE_LIMIT,
            search: search || undefined,
            status: status || undefined
        }
    });
    return {
        items: data.data,
        meta: data.meta
    };
}
function useHosts(params) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminApiKeys.hosts(params),
        queryFn: {
            "useHosts.useQuery": ()=>list("/admin/hosts", params)
        }["useHosts.useQuery"],
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keepPreviousData"],
        refetchInterval: 15_000
    });
}
_s(useHosts, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useHostDetail(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminApiKeys.host(id),
        queryFn: {
            "useHostDetail.useQuery": async ()=>(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/admin/hosts/${id}`)).data.data
        }["useHostDetail.useQuery"]
    });
}
_s1(useHostDetail, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCampaigns(params) {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminApiKeys.campaigns(params),
        queryFn: {
            "useCampaigns.useQuery": ()=>list("/admin/funds", params)
        }["useCampaigns.useQuery"],
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keepPreviousData"],
        refetchInterval: 15_000
    });
}
_s2(useCampaigns, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCampaign(id) {
    _s3();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminApiKeys.campaign(id),
        queryFn: {
            "useCampaign.useQuery": async ()=>(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/admin/funds/${id}`)).data.data
        }["useCampaign.useQuery"]
    });
}
_s3(useCampaign, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCampaignContributions(id, params, enabled = true) {
    _s4();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminApiKeys.contributions(id, params),
        queryFn: {
            "useCampaignContributions.useQuery": ()=>list(`/admin/funds/${id}/contributions`, params)
        }["useCampaignContributions.useQuery"],
        enabled,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keepPreviousData"],
        refetchInterval: 15_000
    });
}
_s4(useCampaignContributions, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useTransactions(params, enabled = true) {
    _s5();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminApiKeys.transactions(params),
        queryFn: {
            "useTransactions.useQuery": ()=>list("/admin/transactions", params)
        }["useTransactions.useQuery"],
        enabled,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keepPreviousData"],
        refetchInterval: 15_000
    });
}
_s5(useTransactions, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useActivity(page) {
    _s6();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminApiKeys.activity(page),
        queryFn: {
            "useActivity.useQuery": ()=>list("/admin/activity", {
                    page
                })
        }["useActivity.useQuery"],
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keepPreviousData"],
        refetchInterval: 15_000
    });
}
_s6(useActivity, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useWithdrawals(params) {
    _s7();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminApiKeys.withdrawals(params),
        queryFn: {
            "useWithdrawals.useQuery": ()=>list("/admin/withdrawals", params)
        }["useWithdrawals.useQuery"],
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keepPreviousData"],
        refetchInterval: 15_000
    });
}
_s7(useWithdrawals, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useUpdateWithdrawalStatus() {
    _s8();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateWithdrawalStatus.useMutation": async ({ id, status, note })=>{
                const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/admin/withdrawals/${id}/status`, {
                    status,
                    note: note || undefined
                });
                return data.data;
            }
        }["useUpdateWithdrawalStatus.useMutation"],
        onSuccess: {
            "useUpdateWithdrawalStatus.useMutation": (withdrawal)=>{
                queryClient.invalidateQueries({
                    queryKey: adminRoot
                });
                const verb = {
                    PROCESSING: "moved to processing",
                    DONE: "marked as done",
                    REJECTED: "rejected",
                    PENDING: "updated"
                }[withdrawal.status];
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`${withdrawal.reference} ${verb}.`);
            }
        }["useUpdateWithdrawalStatus.useMutation"],
        onError: {
            "useUpdateWithdrawalStatus.useMutation": (error)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message ?? "Could not update the request.")
        }["useUpdateWithdrawalStatus.useMutation"]
    });
}
_s8(useUpdateWithdrawalStatus, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateHostStatus() {
    _s9();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateHostStatus.useMutation": async ({ id, status })=>{
                const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/users/${id}/status`, {
                    status
                });
                return data.data;
            }
        }["useUpdateHostStatus.useMutation"],
        onSuccess: {
            "useUpdateHostStatus.useMutation": (user, { name })=>{
                queryClient.invalidateQueries({
                    queryKey: adminRoot
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(user.status === "SUSPENDED" ? `${name} has been suspended.` : user.status === "ACTIVE" ? `${name} now has active access.` : `${name} will be active after their first sign-in.`);
            }
        }["useUpdateHostStatus.useMutation"],
        onError: {
            "useUpdateHostStatus.useMutation": (error)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message ?? "Could not update the host.")
        }["useUpdateHostStatus.useMutation"]
    });
}
_s9(useUpdateHostStatus, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useCreateCampaignForHost() {
    _s10();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateCampaignForHost.useMutation": async (input)=>{
                const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/admin/funds", input);
                return data.data;
            }
        }["useCreateCampaignForHost.useMutation"],
        onSuccess: {
            "useCreateCampaignForHost.useMutation": (project)=>{
                queryClient.invalidateQueries({
                    queryKey: adminRoot
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "projects"
                    ]
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Campaign "${project.name}" created with code ${project.eventCode}.`);
            }
        }["useCreateCampaignForHost.useMutation"],
        onError: {
            "useCreateCampaignForHost.useMutation": (error)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message ?? "Could not create the campaign.")
        }["useCreateCampaignForHost.useMutation"]
    });
}
_s10(useCreateCampaignForHost, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateCampaignStatus() {
    _s11();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateCampaignStatus.useMutation": async ({ id, status, notes, commissionPercentage })=>{
                const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/admin/funds/${id}/status`, {
                    status,
                    notes: notes || undefined,
                    commissionPercentage: commissionPercentage !== undefined ? Number(commissionPercentage) : undefined
                });
                return data.data;
            }
        }["useUpdateCampaignStatus.useMutation"],
        onSuccess: {
            "useUpdateCampaignStatus.useMutation": (fund)=>{
                queryClient.invalidateQueries({
                    queryKey: adminRoot
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "projects"
                    ]
                });
                const verb = fund.status === "PUBLISHED" ? "approved and is now live on the USSD network!" : fund.status === "SCHEDULED" ? "approved and scheduled to go live on start date!" : fund.status === "REJECTED" ? "rejected" : fund.status === "DRAFT" ? "returned to draft" : fund.status === "APPROVED" ? "approved" : "updated";
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Campaign "${fund.name}" ${verb}.`);
            }
        }["useUpdateCampaignStatus.useMutation"],
        onError: {
            "useUpdateCampaignStatus.useMutation": (error)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.message ?? "Could not update the campaign status.")
        }["useUpdateCampaignStatus.useMutation"]
    });
}
_s11(useUpdateCampaignStatus, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useAdmins() {
    _s12();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: adminApiKeys.admins(),
        queryFn: {
            "useAdmins.useQuery": async ()=>(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/users", {
                    params: {
                        role: "SUPER_ADMIN,PLATFORM_ADMIN",
                        limit: 100
                    }
                })).data.data
        }["useAdmins.useQuery"]
    });
}
_s12(useAdmins, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useAddAdmin() {
    _s13();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useAddAdmin.useMutation": async (input)=>(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/users", input)).data.data
        }["useAddAdmin.useMutation"],
        onSuccess: {
            "useAddAdmin.useMutation": (user, input)=>{
                queryClient.invalidateQueries({
                    queryKey: adminApiKeys.admins()
                });
                const name = `${input.firstName} ${input.lastName}`;
                if (user.smsSent) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`${name} was added and sent their sign-in details by SMS.`);
                else __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].warning(`${name} was added, but the SMS could not be sent. Share their email and phone number with them directly.`);
            }
        }["useAddAdmin.useMutation"]
    });
}
_s13(useAddAdmin, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/features/admin/campaigns/AdminCampaigns.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminCampaigns
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$dollar$2d$sign$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleDollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-dollar-sign.mjs [app-client] (ecmascript) <export default as CircleDollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layers.mjs [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$megaphone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Megaphone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/megaphone.mjs [app-client] (ecmascript) <export default as Megaphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-round.mjs [app-client] (ecmascript) <export default as UserRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2d$3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock-3.mjs [app-client] (ecmascript) <export default as Clock3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.mjs [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-grid.mjs [app-client] (ecmascript) <export default as LayoutGrid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list.mjs [app-client] (ecmascript) <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.mjs [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.mjs [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/MetricCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Pagination.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$RowMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/RowMenu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$QueryState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/QueryState.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$debounced$2d$value$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-debounced-value.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/format.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$admin$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/features/admin/admin-api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$ListToolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/features/admin/ListToolbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$campaigns$2f$campaign$2d$status$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/features/admin/campaigns/campaign-status.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$host$2f$campaigns$2f$ConfigureStepsDrawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$campaigns$2f$AdminCreateCampaignModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$campaigns$2f$AdminEditCampaignModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
/** Statuses where an admin can open the USSD steps editor. */ const CONFIGURABLE_STATUSES = [
    "PENDING_REVIEW",
    "APPROVED",
    "SCHEDULED",
    "PUBLISHED"
];
/** Three cards per row on wide screens, so page in threes. */ const CARDS_PER_PAGE = 9;
function AdminCampaigns() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("grid");
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [page, setPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [reviewingCampaign, setReviewingCampaign] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [reviewAction, setReviewAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("APPROVE");
    const [reviewNotes, setReviewNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [reviewCommission, setReviewCommission] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(14);
    const [configuringCampaign, setConfiguringCampaign] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editingCampaign, setEditingCampaign] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [creating, setCreating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const debouncedSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$debounced$2d$value$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebouncedValue"])(search);
    const { data, isPending, isError, error, refetch, isPlaceholderData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$admin$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCampaigns"])({
        page,
        search: debouncedSearch,
        status,
        limit: CARDS_PER_PAGE
    });
    const updateStatusMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$admin$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateCampaignStatus"])();
    const counts = data?.meta.counts;
    const dash = "–";
    function openReview(e, campaign, action) {
        e.preventDefault();
        e.stopPropagation();
        setReviewingCampaign(campaign);
        setReviewAction(action);
        setReviewNotes("");
        setReviewCommission(campaign.commissionPercentage ? Number(campaign.commissionPercentage) : 14);
    }
    async function handleConfirmReview(configureAfterApprove = false) {
        if (!reviewingCampaign) return;
        const targetCampaign = reviewingCampaign;
        try {
            await updateStatusMutation.mutateAsync({
                id: targetCampaign.id,
                status: reviewAction === "APPROVE" ? "PUBLISHED" : "REJECTED",
                notes: reviewNotes.trim() || undefined,
                commissionPercentage: reviewAction === "APPROVE" ? Number(reviewCommission) : undefined
            });
            setReviewingCampaign(null);
            if (reviewAction === "APPROVE" && configureAfterApprove) {
                setConfiguringCampaign(targetCampaign);
            }
        } catch  {
        // Error is toasted by mutation
        }
    }
    function getCampaignMenuItems(campaign) {
        const isPendingReview = campaign.status === "PENDING_REVIEW";
        const items = [
            {
                label: "View details",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                    size: 14,
                    className: "text-steel"
                }, void 0, false, {
                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                    lineNumber: 106,
                    columnNumber: 15
                }, this),
                onSelect: ()=>router.push(`/admin/campaigns/${campaign.id}`)
            },
            {
                label: "Edit campaign",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                    size: 14,
                    className: "text-steel"
                }, void 0, false, {
                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                    lineNumber: 111,
                    columnNumber: 15
                }, this),
                onSelect: ()=>setEditingCampaign(campaign)
            }
        ];
        if (CONFIGURABLE_STATUSES.includes(campaign.status)) {
            items.push({
                label: "Configure steps",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                    size: 14,
                    className: "text-steel"
                }, void 0, false, {
                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                    lineNumber: 119,
                    columnNumber: 15
                }, this),
                onSelect: ()=>setConfiguringCampaign(campaign)
            });
        }
        if (isPendingReview) {
            items.push({
                label: "Approve campaign",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                    size: 14,
                    className: "text-emerald-700"
                }, void 0, false, {
                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                    lineNumber: 128,
                    columnNumber: 17
                }, this),
                onSelect: ()=>{
                    setReviewingCampaign(campaign);
                    setReviewAction("APPROVE");
                    setReviewNotes("");
                    setReviewCommission(campaign.commissionPercentage ? Number(campaign.commissionPercentage) : 14);
                }
            }, {
                label: "Reject campaign",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                    size: 14,
                    className: "text-crimson"
                }, void 0, false, {
                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                    lineNumber: 138,
                    columnNumber: 17
                }, this),
                danger: true,
                onSelect: ()=>{
                    setReviewingCampaign(campaign);
                    setReviewAction("REJECT");
                    setReviewNotes("");
                    setReviewCommission(campaign.commissionPercentage ? Number(campaign.commissionPercentage) : 14);
                }
            });
        }
        return items;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "flex flex-wrap items-start justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-semibold tracking-tight text-navy md:text-3xl",
                                children: "Campaigns"
                            }, void 0, false, {
                                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-sm text-steel",
                                children: "Review host campaigns, approve them for the live USSD network, and monitor overall fundraising progress."
                            }, void 0, false, {
                                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                lineNumber: 158,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setCreating(true),
                        className: "inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-steel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                size: 18,
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this),
                            "Create campaign"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                lineNumber: 155,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        label: "Total raised",
                        value: counts ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMoney"])(counts.raised) : dash,
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$dollar$2d$sign$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleDollarSign$3e$__["CircleDollarSign"],
                        accent: "green"
                    }, void 0, false, {
                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        label: "Total campaigns",
                        value: counts ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCount"])(counts.total) : dash,
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"],
                        accent: "blue"
                    }, void 0, false, {
                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        label: "Pending Review",
                        value: counts ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCount"])(counts.pendingReview ?? 0) : dash,
                        detail: "Awaiting approval to go live",
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2d$3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock3$3e$__["Clock3"],
                        accent: "gold"
                    }, void 0, false, {
                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                        lineNumber: 186,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$MetricCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        label: "Published (Live)",
                        value: counts ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCount"])(counts.published) : dash,
                        detail: "Collecting contributions",
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$megaphone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Megaphone$3e$__["Megaphone"],
                        accent: "purple"
                    }, void 0, false, {
                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                        lineNumber: 193,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                lineNumber: 173,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "overflow-hidden surface-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$ListToolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        search: search,
                        onSearch: (value)=>{
                            setSearch(value);
                            setPage(1);
                        },
                        searchLabel: "Search by name or event code",
                        status: status,
                        onStatus: (value)=>{
                            setStatus(value);
                            setPage(1);
                        },
                        statuses: [
                            {
                                value: "PENDING_REVIEW",
                                label: "Pending Review"
                            },
                            {
                                value: "APPROVED",
                                label: "Approved"
                            },
                            {
                                value: "SCHEDULED",
                                label: "Upcoming"
                            },
                            {
                                value: "PUBLISHED",
                                label: "Active"
                            },
                            {
                                value: "REJECTED",
                                label: "Rejected"
                            },
                            {
                                value: "SUSPENDED",
                                label: "Suspended"
                            }
                        ],
                        extraControls: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center rounded-xl border border-navy/15 bg-white p-1 shrink-0",
                            role: "group",
                            "aria-label": "Toggle view mode",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setViewMode("list"),
                                    className: `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${viewMode === "list" ? "bg-navy text-white shadow-xs" : "text-steel hover:text-navy"}`,
                                    "aria-pressed": viewMode === "list",
                                    title: "List view",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"], {
                                            size: 15
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 239,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "hidden sm:inline",
                                            children: "List"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 240,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 229,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setViewMode("grid"),
                                    className: `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${viewMode === "grid" ? "bg-navy text-white shadow-xs" : "text-steel hover:text-navy"}`,
                                    "aria-pressed": viewMode === "grid",
                                    title: "Grid view",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"], {
                                            size: 15
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 252,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "hidden sm:inline",
                                            children: "Grid"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 253,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 242,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                            lineNumber: 224,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                        lineNumber: 203,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 md:p-5",
                        children: isPending ? viewMode === "grid" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
                            children: Array.from({
                                length: 3
                            }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$QueryState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-44 rounded-xl"
                                }, i, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 264,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                            lineNumber: 262,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: Array.from({
                                length: 4
                            }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$QueryState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-16 rounded-xl"
                                }, i, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 270,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                            lineNumber: 268,
                            columnNumber: 15
                        }, this) : isError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$QueryState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorNote"], {
                            message: error.message,
                            onRetry: ()=>refetch()
                        }, void 0, false, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                            lineNumber: 275,
                            columnNumber: 13
                        }, this) : data.items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "py-8 text-center text-sm text-steel",
                            children: search || status ? "No campaigns match your search." : "No campaigns yet. Campaigns submitted by hosts will appear here."
                        }, void 0, false, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                            lineNumber: 280,
                            columnNumber: 13
                        }, this) : viewMode === "list" ? /* Admin Campaigns List (Table) View */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "overflow-x-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "w-full text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        className: "border-b border-navy/10 bg-stone-light/50 text-xs font-semibold text-steel",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    scope: "col",
                                                    className: "px-5 py-3.5",
                                                    children: "Campaign"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    scope: "col",
                                                    className: "px-4 py-3.5",
                                                    children: "Host"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                    lineNumber: 294,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    scope: "col",
                                                    className: "px-4 py-3.5",
                                                    children: "Raised / Target"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                    lineNumber: 297,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    scope: "col",
                                                    className: "px-4 py-3.5",
                                                    children: "Status"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                    lineNumber: 300,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    scope: "col",
                                                    className: "px-4 py-3.5",
                                                    children: "Contributions"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                    lineNumber: 303,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    scope: "col",
                                                    className: "px-5 py-3.5 text-right",
                                                    children: "Actions"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                    lineNumber: 306,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 290,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                        lineNumber: 289,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        className: "divide-y divide-navy/10",
                                        children: data.items.map((campaign)=>{
                                            const percent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$campaigns$2f$campaign$2d$status$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["progressPercent"])(campaign.raised, campaign.targetAmount);
                                            const isPendingReview = campaign.status === "PENDING_REVIEW";
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: `transition-colors hover:bg-stone-light/40 ${isPendingReview ? "bg-amber-50/30" : ""}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-5 py-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                href: `/admin/campaigns/${campaign.id}`,
                                                                className: "font-semibold text-navy hover:text-gold transition-colors block text-sm",
                                                                children: campaign.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                lineNumber: 323,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mt-0.5 flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs text-steel font-mono",
                                                                        children: [
                                                                            "*920*969*",
                                                                            campaign.eventCode,
                                                                            "#"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                        lineNumber: 330,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "inline-flex items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200/60",
                                                                        children: [
                                                                            campaign.commissionPercentage ?? "14",
                                                                            "% fee"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                        lineNumber: 331,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    campaign.settings?.webPortalEnabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "inline-flex items-center rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200/60",
                                                                        title: "Web donation portal enabled (+1% commission)",
                                                                        children: "Web (+1%)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                        lineNumber: 335,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                lineNumber: 329,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                        lineNumber: 322,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4 text-sm text-navy",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__["UserRound"], {
                                                                    size: 14,
                                                                    className: "text-steel"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                    lineNumber: 347,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "truncate max-w-[140px]",
                                                                    children: campaign.hostName
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                    lineNumber: 348,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                            lineNumber: 346,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                        lineNumber: 345,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold text-sm text-navy",
                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMoney"])(campaign.raised)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                lineNumber: 353,
                                                                columnNumber: 27
                                                            }, this),
                                                            percent !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mt-1 flex items-center gap-2 max-w-[140px]",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$campaigns$2f$campaign$2d$status$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProgressBar"], {
                                                                        percent: percent
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                        lineNumber: 358,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[11px] text-steel shrink-0",
                                                                        children: [
                                                                            percent,
                                                                            "%"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                        lineNumber: 359,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                lineNumber: 357,
                                                                columnNumber: 29
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-steel",
                                                                children: "No target"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                lineNumber: 362,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                        lineNumber: 352,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$campaigns$2f$campaign$2d$status$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CampaignStatusBadge"], {
                                                            status: campaign.status,
                                                            startDate: campaign.startDate,
                                                            endDate: campaign.endDate
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                            lineNumber: 367,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                        lineNumber: 366,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4 text-sm text-steel",
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCount"])(campaign.transactions)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                        lineNumber: 370,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-5 py-4 text-right",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-end gap-2",
                                                            children: [
                                                                isPendingReview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: (e)=>openReview(e, campaign, "APPROVE"),
                                                                            disabled: updateStatusMutation.isPending,
                                                                            className: "inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-800 transition-colors shadow-xs",
                                                                            title: "Approve campaign",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                    size: 13
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                                    lineNumber: 385,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    children: "Approve"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                                    lineNumber: 386,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                            lineNumber: 378,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: (e)=>openReview(e, campaign, "REJECT"),
                                                                            disabled: updateStatusMutation.isPending,
                                                                            className: "inline-flex items-center gap-1 rounded-lg border border-crimson/30 bg-white px-2.5 py-1.5 text-xs font-medium text-crimson hover:bg-crimson/5 transition-colors",
                                                                            title: "Reject campaign",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                                    size: 13
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                                    lineNumber: 395,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    children: "Reject"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                                    lineNumber: 396,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                            lineNumber: 388,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                    lineNumber: 377,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$RowMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    label: `Actions for ${campaign.name}`,
                                                                    items: getCampaignMenuItems(campaign)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                    lineNumber: 400,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                            lineNumber: 375,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                        lineNumber: 374,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, campaign.id, true, {
                                                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                lineNumber: 317,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                        lineNumber: 311,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                lineNumber: 288,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                            lineNumber: 287,
                            columnNumber: 13
                        }, this) : /* Admin Campaigns Grid View */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `grid gap-4 transition-opacity md:grid-cols-2 xl:grid-cols-3 ${isPlaceholderData ? "opacity-60" : ""}`,
                            children: data.items.map((campaign)=>{
                                const percent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$campaigns$2f$campaign$2d$status$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["progressPercent"])(campaign.raised, campaign.targetAmount);
                                const isPendingReview = campaign.status === "PENDING_REVIEW";
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `flex flex-col rounded-xl border bg-white p-5 transition hover:shadow-md ${isPendingReview ? "border-amber-300/80 bg-amber-50/20 shadow-sm" : "border-navy/10 hover:border-navy/25"}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start justify-between gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: `/admin/campaigns/${campaign.id}`,
                                                            className: "truncate font-semibold text-navy hover:text-gold transition-colors block",
                                                            children: campaign.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                            lineNumber: 432,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-0.5 flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs text-steel font-mono",
                                                                    children: [
                                                                        "Code: *920*969*",
                                                                        campaign.eventCode,
                                                                        "#"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                    lineNumber: 439,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "inline-flex items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200/60",
                                                                    children: [
                                                                        campaign.commissionPercentage ?? "14",
                                                                        "% fee"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                    lineNumber: 440,
                                                                    columnNumber: 27
                                                                }, this),
                                                                campaign.settings?.webPortalEnabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "inline-flex items-center rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200/60",
                                                                    title: "Web donation portal enabled (+1% commission)",
                                                                    children: "Web (+1%)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                    lineNumber: 444,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                            lineNumber: 438,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                    lineNumber: 431,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$campaigns$2f$campaign$2d$status$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CampaignStatusBadge"], {
                                                    status: campaign.status,
                                                    startDate: campaign.startDate,
                                                    endDate: campaign.endDate
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                    lineNumber: 453,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 430,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-4 flex items-center gap-2 text-sm text-ink",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__["UserRound"], {
                                                    size: 15,
                                                    className: "text-steel"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                    lineNumber: 457,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate",
                                                    children: campaign.hostName
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                    lineNumber: 458,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 456,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-4 text-2xl font-semibold tracking-tight text-navy",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMoney"])(campaign.raised)
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 461,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2",
                                            children: percent === null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-steel",
                                                children: "No target set"
                                            }, void 0, false, {
                                                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                lineNumber: 466,
                                                columnNumber: 25
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$campaigns$2f$campaign$2d$status$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProgressBar"], {
                                                        percent: percent
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                        lineNumber: 469,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-1.5 text-xs text-steel",
                                                        children: [
                                                            percent,
                                                            "% of ",
                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMoney"])(campaign.targetAmount)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                        lineNumber: 470,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                lineNumber: 468,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 464,
                                            columnNumber: 21
                                        }, this),
                                        isPendingReview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 rounded-lg bg-amber-100/70 p-3 border border-amber-200/60",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5 text-xs font-semibold text-amber-900 mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                            size: 14,
                                                            className: "shrink-0"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                            lineNumber: 481,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Awaiting Admin Approval"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                            lineNumber: 482,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                    lineNumber: 480,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[11px] text-amber-800/90 leading-relaxed mb-3",
                                                    children: "Review this host campaign to approve it for the live USSD network."
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                    lineNumber: 484,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: (e)=>openReview(e, campaign, "APPROVE"),
                                                            disabled: updateStatusMutation.isPending,
                                                            className: "flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-800 transition-colors shadow-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                    size: 13
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                    lineNumber: 494,
                                                                    columnNumber: 29
                                                                }, this),
                                                                "Approve"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                            lineNumber: 488,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: (e)=>openReview(e, campaign, "REJECT"),
                                                            disabled: updateStatusMutation.isPending,
                                                            className: "inline-flex items-center justify-center gap-1.5 rounded-lg border border-crimson/30 bg-white px-3 py-1.5 text-xs font-medium text-crimson hover:bg-crimson/5 transition-colors",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                    size: 13
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                                    lineNumber: 503,
                                                                    columnNumber: 29
                                                                }, this),
                                                                "Reject"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                            lineNumber: 497,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                    lineNumber: 487,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 479,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-auto pt-4 flex items-center justify-between border-t border-navy/10 text-xs text-steel",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCount"])(campaign.transactions),
                                                        " contributions"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                    lineNumber: 511,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$RowMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    label: `Actions for ${campaign.name}`,
                                                    items: getCampaignMenuItems(campaign)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                    lineNumber: 512,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 510,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, campaign.id, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 423,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                            lineNumber: 414,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                        lineNumber: 259,
                        columnNumber: 9
                    }, this),
                    data && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        page: page,
                        totalPages: data.meta.totalPages,
                        total: data.meta.total,
                        pageSize: CARDS_PER_PAGE,
                        label: "campaigns",
                        onPageChange: setPage
                    }, void 0, false, {
                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                        lineNumber: 525,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                lineNumber: 202,
                columnNumber: 7
            }, this),
            reviewingCampaign && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: reviewAction === "APPROVE" ? "Approve Campaign & Go Live" : "Reject Campaign",
                onClose: ()=>setReviewingCampaign(null),
                footer: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-end gap-3 w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setReviewingCampaign(null),
                            disabled: updateStatusMutation.isPending,
                            className: "rounded-xl border border-navy/20 bg-white px-4 py-2 text-sm font-medium hover:bg-stone disabled:opacity-50 transition-colors",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                            lineNumber: 547,
                            columnNumber: 15
                        }, this),
                        reviewAction === "APPROVE" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleConfirmReview(true),
                                    disabled: updateStatusMutation.isPending,
                                    className: "inline-flex items-center gap-1.5 rounded-xl border border-emerald-600/40 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                            size: 14,
                                            className: "text-emerald-700"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 563,
                                            columnNumber: 21
                                        }, this),
                                        "Approve & Configure Steps"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 557,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleConfirmReview(false),
                                    disabled: updateStatusMutation.isPending,
                                    className: "inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 transition-colors shadow-sm",
                                    children: updateStatusMutation.isPending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                size: 15,
                                                className: "animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                lineNumber: 574,
                                                columnNumber: 25
                                            }, this),
                                            "Updating..."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                        lineNumber: 573,
                                        columnNumber: 23
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                size: 15
                                            }, void 0, false, {
                                                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                                lineNumber: 579,
                                                columnNumber: 25
                                            }, this),
                                            "Confirm Approval & Go Live"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                        lineNumber: 578,
                                        columnNumber: 23
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 566,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                            lineNumber: 556,
                            columnNumber: 17
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>handleConfirmReview(false),
                            disabled: updateStatusMutation.isPending,
                            className: "inline-flex items-center gap-2 rounded-xl bg-crimson px-4 py-2 text-sm font-medium text-white hover:bg-crimson/90 transition-colors shadow-sm",
                            children: updateStatusMutation.isPending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        size: 15,
                                        className: "animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                        lineNumber: 594,
                                        columnNumber: 23
                                    }, this),
                                    "Updating..."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                lineNumber: 593,
                                columnNumber: 21
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 15
                                    }, void 0, false, {
                                        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                        lineNumber: 599,
                                        columnNumber: 23
                                    }, this),
                                    "Confirm Rejection"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                lineNumber: 598,
                                columnNumber: 21
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                            lineNumber: 586,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                    lineNumber: 546,
                    columnNumber: 13
                }, this),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-xl bg-stone-light p-3.5 border border-navy/10 space-y-1.5 text-xs text-steel",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "text-navy",
                                            children: "Campaign:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 611,
                                            columnNumber: 17
                                        }, this),
                                        " ",
                                        reviewingCampaign.name
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 610,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "text-navy",
                                            children: "Host:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 614,
                                            columnNumber: 17
                                        }, this),
                                        " ",
                                        reviewingCampaign.hostName
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 613,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "text-navy",
                                            children: "USSD Code:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 617,
                                            columnNumber: 17
                                        }, this),
                                        " *920*969*",
                                        reviewingCampaign.eventCode,
                                        "#"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 616,
                                    columnNumber: 15
                                }, this),
                                reviewingCampaign.requestedCode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "text-navy",
                                            children: "Requested Code:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 622,
                                            columnNumber: 19
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-mono",
                                            children: reviewingCampaign.requestedCode
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 623,
                                            columnNumber: 19
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-steel",
                                            children: "(host asked for a special code)"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 624,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 621,
                                    columnNumber: 17
                                }, this),
                                reviewingCampaign.targetAmount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "text-navy",
                                            children: "Target:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 629,
                                            columnNumber: 19
                                        }, this),
                                        " ",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMoney"])(reviewingCampaign.targetAmount)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 628,
                                    columnNumber: 17
                                }, this),
                                reviewingCampaign.commissionPercentage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "text-navy",
                                            children: "Configured Commission:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 635,
                                            columnNumber: 19
                                        }, this),
                                        " ",
                                        reviewingCampaign.commissionPercentage,
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 634,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "text-navy",
                                            children: "Web Portal:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 640,
                                            columnNumber: 17
                                        }, this),
                                        " ",
                                        reviewingCampaign.settings?.webPortalEnabled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-emerald-700",
                                            children: "Enabled (+1% commission)"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 642,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-steel",
                                            children: "Disabled"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 646,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 639,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                            lineNumber: 609,
                            columnNumber: 13
                        }, this),
                        reviewAction === "APPROVE" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-steel leading-relaxed",
                            children: [
                                "Approving this campaign will set its status to",
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "text-navy",
                                    children: "Published"
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 654,
                                    columnNumber: 17
                                }, this),
                                ". It will immediately begin accepting Mobile Money contributions on the live USSD network under code",
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "text-navy font-mono",
                                    children: [
                                        "*920*969*",
                                        reviewingCampaign.eventCode,
                                        "#"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 656,
                                    columnNumber: 17
                                }, this),
                                "."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                            lineNumber: 652,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-steel leading-relaxed",
                            children: [
                                "Rejecting this campaign will set its status to",
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "text-navy",
                                    children: "Rejected"
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 664,
                                    columnNumber: 17
                                }, this),
                                ". The host will be notified to make necessary corrections before re-submitting."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                            lineNumber: 662,
                            columnNumber: 15
                        }, this),
                        reviewAction === "APPROVE" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "review-commission",
                                    className: "text-xs font-semibold text-navy flex items-center justify-between mb-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Commission Percentage (%) *"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 672,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[11px] font-normal text-steel",
                                            children: "Standard default: 14%"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 673,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 671,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "review-commission",
                                            type: "number",
                                            min: "0",
                                            max: "100",
                                            step: "0.1",
                                            value: reviewCommission,
                                            onChange: (e)=>setReviewCommission(e.target.value),
                                            placeholder: "14",
                                            className: "w-full rounded-xl border border-navy/20 bg-white px-3 py-2 pr-8 text-xs font-semibold text-navy focus:border-navy focus:outline-none",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 676,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-steel",
                                            children: "%"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                            lineNumber: 688,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 675,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1 text-[11px] text-steel",
                                    children: "Platform fee charged on contributions received for this campaign. Differing rates can be specified per campaign."
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 692,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                            lineNumber: 670,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "review-notes",
                                    className: "text-xs font-semibold text-navy block mb-1",
                                    children: reviewAction === "APPROVE" ? "Admin Notes (Optional)" : "Rejection Reason / Feedback for Host *"
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 699,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    id: "review-notes",
                                    rows: 3,
                                    placeholder: reviewAction === "APPROVE" ? "Optional note regarding campaign verification or approval..." : "Explain what the host needs to revise or correct...",
                                    value: reviewNotes,
                                    onChange: (e)=>setReviewNotes(e.target.value),
                                    className: "w-full rounded-xl border border-navy/20 bg-white px-3 py-2 text-xs text-navy focus:border-navy focus:outline-none"
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                                    lineNumber: 704,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                            lineNumber: 698,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                    lineNumber: 608,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                lineNumber: 538,
                columnNumber: 9
            }, this),
            creating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$campaigns$2f$AdminCreateCampaignModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onClose: ()=>setCreating(false),
                onCreated: (campaign, configureSteps)=>{
                    setCreating(false);
                    if (configureSteps) setConfiguringCampaign(campaign);
                }
            }, void 0, false, {
                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                lineNumber: 722,
                columnNumber: 9
            }, this),
            editingCampaign && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$campaigns$2f$AdminEditCampaignModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                campaign: editingCampaign,
                onClose: ()=>setEditingCampaign(null),
                onUpdated: ()=>{
                    setEditingCampaign(null);
                    refetch();
                }
            }, void 0, false, {
                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                lineNumber: 732,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$host$2f$campaigns$2f$ConfigureStepsDrawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConfigureStepsDrawer"], {
                campaign: configuringCampaign,
                open: Boolean(configuringCampaign),
                onClose: ()=>setConfiguringCampaign(null)
            }, void 0, false, {
                fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
                lineNumber: 743,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/features/admin/campaigns/AdminCampaigns.tsx",
        lineNumber: 154,
        columnNumber: 5
    }, this);
}
_s(AdminCampaigns, "cgE0074jOPzLOnPjhTAuEkwv3yg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$debounced$2d$value$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebouncedValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$admin$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCampaigns"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$admin$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateCampaignStatus"]
    ];
});
_c = AdminCampaigns;
var _c;
__turbopack_context__.k.register(_c, "AdminCampaigns");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminCreateCampaignModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$dist$2f$react$2d$select$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-select/dist/react-select.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.mjs [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$selectStyles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/selectStyles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$host$2f$campaigns$2f$use$2d$campaigns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/features/host/campaigns/use-campaigns.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$host$2f$campaigns$2f$SpecialCodeField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/features/host/campaigns/SpecialCodeField.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$admin$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/features/admin/admin-api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
const inputClass = "w-full rounded-xl border border-navy/20 bg-white px-3 py-2 text-sm text-navy focus:border-navy focus:outline-none disabled:opacity-60";
const selectStyles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$selectStyles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSelectStyles"])({
    minHeight: "42px",
    borderColor: "rgba(11, 37, 69, 0.2)"
});
function AdminCreateCampaignModal({ onClose, onCreated }) {
    _s();
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AdminCreateCampaignModal.useMemo[today]": ()=>new Date().toISOString().slice(0, 10)
    }["AdminCreateCampaignModal.useMemo[today]"], []);
    const [host, setHost] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [category, setCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [code, setCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [codeStatus, setCodeStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("idle");
    const handleCodeStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AdminCreateCampaignModal.useCallback[handleCodeStatus]": (status)=>setCodeStatus(status)
    }["AdminCreateCampaignModal.useCallback[handleCodeStatus]"], []);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [enableWebPortal, setEnableWebPortal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    /** Which submit button was pressed: "Create & configure steps" or plain "Create campaign". */ const configureAfterCreate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const { data: hostsPage, isPending: hostsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$admin$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHosts"])({
        page: 1,
        limit: 100
    });
    const { data: categories = [], isLoading: categoriesLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$host$2f$campaigns$2f$use$2d$campaigns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectCategoriesQuery"])();
    const createMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$admin$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreateCampaignForHost"])();
    const hostOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AdminCreateCampaignModal.useMemo[hostOptions]": ()=>(hostsPage?.items ?? []).map({
                "AdminCreateCampaignModal.useMemo[hostOptions]": (h)=>({
                        value: h.id,
                        label: `${h.firstName} ${h.lastName}`.trim() + ` (${h.email})`
                    })
            }["AdminCreateCampaignModal.useMemo[hostOptions]"])
    }["AdminCreateCampaignModal.useMemo[hostOptions]"], [
        hostsPage
    ]);
    const categoryOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AdminCreateCampaignModal.useMemo[categoryOptions]": ()=>categories.map({
                "AdminCreateCampaignModal.useMemo[categoryOptions]": (c)=>({
                        value: c.id,
                        label: c.name
                    })
            }["AdminCreateCampaignModal.useMemo[categoryOptions]"])
    }["AdminCreateCampaignModal.useMemo[categoryOptions]"], [
        categories
    ]);
    function fail(message) {
        setError(message);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(message);
    }
    async function submit(event) {
        event.preventDefault();
        const configureSteps = configureAfterCreate.current;
        setError("");
        const form = new FormData(event.currentTarget);
        const name = String(form.get("name") || "").trim();
        const goal = String(form.get("goal") || "").trim();
        const startDate = String(form.get("startDate") || "").trim();
        const closing = String(form.get("closing") || "").trim();
        const location = String(form.get("location") || "").trim();
        const description = String(form.get("description") || "").trim();
        const commission = String(form.get("commission") || "").trim();
        if (!host) return fail("Select the host this campaign belongs to.");
        if (name.length < 2) return fail("Campaign name must be at least 2 characters.");
        if (!category) return fail("Please select a category.");
        if (!/^\d+(\.\d{1,2})?$/.test(goal) || Number(goal) <= 0) {
            return fail("Please enter a valid fundraising goal in GH₵ (up to 2 decimals).");
        }
        if (!startDate) return fail("Start date is required.");
        if (closing && startDate > closing) return fail("Start date cannot be after closing date.");
        if (code && codeStatus !== "available") {
            return fail(codeStatus === "taken" ? `Code ${code} is already taken. Choose another or clear the field to auto-generate one.` : "Please wait for the code check to finish, with a code of 2 to 4 digits.");
        }
        if (commission && (Number(commission) < 0 || Number(commission) > 100)) {
            return fail("Commission must be between 0 and 100.");
        }
        const welcomeMessage = (location ? `Welcome to ${name} (${location}). Dial 1 to contribute.` : `Welcome to ${name}. Dial 1 to contribute.`).slice(0, 120);
        try {
            const project = await createMutation.mutateAsync({
                hostId: host.value,
                name,
                description: description || undefined,
                categoryId: category.value,
                eventCode: code || undefined,
                targetAmount: Number(goal).toFixed(2),
                welcomeMessage,
                startDate: `${startDate}T00:00:00.000Z`,
                endDate: closing ? `${closing}T23:59:59.000Z` : undefined,
                commissionPercentage: commission ? Number(commission) : undefined,
                enableWebPortal
            });
            onCreated({
                id: project.id,
                name: project.name,
                eventCode: project.eventCode,
                currency: project.currency,
                welcomeMessage: project.welcomeMessage
            }, configureSteps);
        } catch  {
        // The mutation toasts the error; keep the form open so nothing typed is lost.
        }
    }
    const busy = createMutation.isPending;
    const formId = "admin-create-campaign-form";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        title: "Create campaign for a host",
        eyebrow: "Admin",
        onClose: ()=>!busy && onClose(),
        footer: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-wrap items-center justify-end gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: onClose,
                    disabled: busy,
                    className: "rounded-xl border border-navy/20 bg-white px-4 py-2 text-sm font-medium hover:bg-stone disabled:opacity-50",
                    children: "Cancel"
                }, void 0, false, {
                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                    lineNumber: 142,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "submit",
                    form: formId,
                    disabled: busy,
                    onClick: ()=>{
                        configureAfterCreate.current = true;
                    },
                    className: "inline-flex items-center gap-1.5 rounded-xl border border-navy/20 bg-white px-4 py-2 text-sm font-medium text-navy hover:bg-stone disabled:opacity-50",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                            lineNumber: 159,
                            columnNumber: 13
                        }, this),
                        "Create & configure steps"
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                    lineNumber: 150,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "submit",
                    form: formId,
                    disabled: busy,
                    onClick: ()=>{
                        configureAfterCreate.current = false;
                    },
                    className: "inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-steel disabled:opacity-50",
                    children: busy ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                size: 15,
                                className: "animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                lineNumber: 173,
                                columnNumber: 17
                            }, this),
                            "Creating..."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                        lineNumber: 172,
                        columnNumber: 15
                    }, this) : "Create campaign"
                }, void 0, false, {
                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                    lineNumber: 162,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
            lineNumber: 141,
            columnNumber: 9
        }, this),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            id: formId,
            onSubmit: submit,
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "admin-campaign-host",
                            className: "text-sm font-medium",
                            children: [
                                "Host ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-crimson",
                                    children: "*"
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                    lineNumber: 190,
                                    columnNumber: 18
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                            lineNumber: 189,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$dist$2f$react$2d$select$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
                                inputId: "admin-campaign-host",
                                instanceId: "admin-campaign-host-select",
                                value: host,
                                onChange: setHost,
                                options: hostOptions,
                                isLoading: hostsLoading,
                                isDisabled: busy,
                                placeholder: hostsLoading ? "Loading hosts..." : "Select a host",
                                styles: selectStyles
                            }, void 0, false, {
                                fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                lineNumber: 193,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                            lineNumber: 192,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                    lineNumber: 188,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "admin-campaign-name",
                            className: "text-sm font-medium",
                            children: [
                                "Campaign name ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-crimson",
                                    children: "*"
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                    lineNumber: 209,
                                    columnNumber: 27
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                            lineNumber: 208,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "admin-campaign-name",
                            name: "name",
                            required: true,
                            minLength: 2,
                            maxLength: 100,
                            disabled: busy,
                            placeholder: "e.g. Asankrangwa Community Water Project",
                            className: `${inputClass} mt-2`
                        }, void 0, false, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                            lineNumber: 211,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                    lineNumber: 207,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-4 sm:grid-cols-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "admin-campaign-category",
                                    className: "text-sm font-medium",
                                    children: [
                                        "Category ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-crimson",
                                            children: "*"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                            lineNumber: 226,
                                            columnNumber: 24
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                    lineNumber: 225,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$dist$2f$react$2d$select$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
                                        inputId: "admin-campaign-category",
                                        instanceId: "admin-campaign-category-select",
                                        value: category,
                                        onChange: setCategory,
                                        options: categoryOptions,
                                        isLoading: categoriesLoading,
                                        isDisabled: busy,
                                        placeholder: "Select a category",
                                        styles: selectStyles
                                    }, void 0, false, {
                                        fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                        lineNumber: 229,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                    lineNumber: 228,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                            lineNumber: 224,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "admin-campaign-location",
                                    className: "text-sm font-medium",
                                    children: "Town / City & Region"
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                    lineNumber: 243,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    id: "admin-campaign-location",
                                    name: "location",
                                    maxLength: 80,
                                    disabled: busy,
                                    placeholder: "e.g. Ho, Volta Region",
                                    className: `${inputClass} mt-2`
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                    lineNumber: 246,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                            lineNumber: 242,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                    lineNumber: 223,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-4 sm:grid-cols-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "admin-campaign-goal",
                                    className: "text-sm font-medium",
                                    children: [
                                        "Fundraising goal (GH₵) ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-crimson",
                                            children: "*"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                            lineNumber: 260,
                                            columnNumber: 38
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                    lineNumber: 259,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    id: "admin-campaign-goal",
                                    name: "goal",
                                    required: true,
                                    type: "number",
                                    min: "1",
                                    step: "0.01",
                                    inputMode: "decimal",
                                    disabled: busy,
                                    placeholder: "25000.00",
                                    className: `${inputClass} mt-2`
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                    lineNumber: 262,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                            lineNumber: 258,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "admin-campaign-commission",
                                    className: "text-sm font-medium",
                                    children: "Commission (%)"
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                    lineNumber: 276,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    id: "admin-campaign-commission",
                                    name: "commission",
                                    type: "number",
                                    min: "0",
                                    max: "100",
                                    step: "0.1",
                                    disabled: busy,
                                    placeholder: "14",
                                    className: `${inputClass} mt-2`
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                    lineNumber: 279,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                            lineNumber: 275,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                    lineNumber: 257,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-4 sm:grid-cols-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "admin-campaign-start",
                                    className: "text-sm font-medium",
                                    children: [
                                        "Start date ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-crimson",
                                            children: "*"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                            lineNumber: 296,
                                            columnNumber: 26
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                    lineNumber: 295,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    id: "admin-campaign-start",
                                    name: "startDate",
                                    required: true,
                                    type: "date",
                                    min: today,
                                    defaultValue: today,
                                    disabled: busy,
                                    className: `${inputClass} mt-2`
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                    lineNumber: 298,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                            lineNumber: 294,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "admin-campaign-closing",
                                    className: "text-sm font-medium",
                                    children: "Closing date (optional)"
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                    lineNumber: 310,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    id: "admin-campaign-closing",
                                    name: "closing",
                                    type: "date",
                                    min: today,
                                    disabled: busy,
                                    className: `${inputClass} mt-2`
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                    lineNumber: 313,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                            lineNumber: 309,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                    lineNumber: 293,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-xl border border-navy/10 bg-stone-light p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$host$2f$campaigns$2f$SpecialCodeField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SpecialCodeField"], {
                        id: "admin-campaign-code",
                        label: "Campaign code (optional)",
                        value: code,
                        onChange: setCode,
                        onStatusChange: handleCodeStatus,
                        disabled: busy,
                        hint: "Leave blank to auto-generate the next 4-digit code, or enter a special 2 to 4 digit code."
                    }, void 0, false, {
                        fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                        lineNumber: 325,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                    lineNumber: 324,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "admin-campaign-description",
                            className: "text-sm font-medium",
                            children: "Campaign description"
                        }, void 0, false, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                            lineNumber: 337,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            id: "admin-campaign-description",
                            name: "description",
                            rows: 3,
                            maxLength: 2000,
                            disabled: busy,
                            className: `${inputClass} mt-2 resize-y`
                        }, void 0, false, {
                            fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                            lineNumber: 340,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                    lineNumber: 336,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-xl border border-navy/15 bg-stone-light/40 p-3.5 transition-colors hover:border-navy/30",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "admin-campaign-web-portal",
                        className: "flex items-start gap-3 cursor-pointer select-none",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "checkbox",
                                id: "admin-campaign-web-portal",
                                checked: enableWebPortal,
                                onChange: (e)=>setEnableWebPortal(e.target.checked),
                                disabled: busy,
                                className: "mt-0.5 h-4 w-4 rounded accent-navy focus:ring-navy"
                            }, void 0, false, {
                                fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                lineNumber: 356,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-semibold text-navy",
                                                children: "Enable Online Web Donation Portal"
                                            }, void 0, false, {
                                                fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                                lineNumber: 366,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200",
                                                children: "+1% commission"
                                            }, void 0, false, {
                                                fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                                lineNumber: 369,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                        lineNumber: 365,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11px] text-steel leading-relaxed",
                                        children: "Attracts an additional 1% platform commission on web contributions. Gives donors a dedicated web portal to donate via Cards, Apple Pay, and Mobile Money."
                                    }, void 0, false, {
                                        fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                        lineNumber: 373,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                                lineNumber: 364,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                        lineNumber: 352,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                    lineNumber: 351,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    role: "alert",
                    className: "rounded-xl border border-crimson/20 bg-white p-3 text-sm text-crimson",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                    lineNumber: 381,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-steel",
                    children: "The campaign belongs to the selected host and goes live straight away (or when its start date arrives), so you can configure its steps right after creating it."
                }, void 0, false, {
                    fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
                    lineNumber: 385,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
            lineNumber: 183,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/features/admin/campaigns/AdminCreateCampaignModal.tsx",
        lineNumber: 136,
        columnNumber: 5
    }, this);
}
_s(AdminCreateCampaignModal, "Shg1akxCdyDEObXGrnk+cobqh54=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$admin$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHosts"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$host$2f$campaigns$2f$use$2d$campaigns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectCategoriesQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$admin$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreateCampaignForHost"]
    ];
});
_c = AdminCreateCampaignModal;
var _c;
__turbopack_context__.k.register(_c, "AdminCreateCampaignModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminEditCampaignModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$dist$2f$react$2d$select$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-select/dist/react-select.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.mjs [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hash.mjs [app-client] (ecmascript) <export default as Hash>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-round.mjs [app-client] (ecmascript) <export default as UserRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$selectStyles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/selectStyles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$host$2f$campaigns$2f$use$2d$campaigns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/features/host/campaigns/use-campaigns.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$projects$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/projects.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$admin$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/features/admin/admin-api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
const inputClass = "w-full rounded-xl border border-navy/20 bg-white px-3 py-2 text-sm text-navy focus:border-navy focus:outline-none disabled:opacity-60";
const selectStyles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$selectStyles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSelectStyles"])({
    minHeight: "42px",
    borderColor: "rgba(11, 37, 69, 0.2)"
});
const STATUS_OPTIONS = [
    {
        value: "PUBLISHED",
        label: "Published (Live on USSD)"
    },
    {
        value: "APPROVED",
        label: "Approved"
    },
    {
        value: "SCHEDULED",
        label: "Upcoming / Scheduled"
    },
    {
        value: "PENDING_REVIEW",
        label: "Pending Review"
    },
    {
        value: "REJECTED",
        label: "Rejected"
    },
    {
        value: "SUSPENDED",
        label: "Suspended"
    },
    {
        value: "DRAFT",
        label: "Draft"
    },
    {
        value: "COMPLETED",
        label: "Completed"
    },
    {
        value: "ARCHIVED",
        label: "Archived"
    }
];
function AdminEditCampaignModal({ campaign, onClose, onUpdated }) {
    _s();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [userCategory, setUserCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userStatus, setUserStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userWebPortal, setUserWebPortal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { data: categories = [], isLoading: categoriesLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$host$2f$campaigns$2f$use$2d$campaigns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectCategoriesQuery"])();
    const { data: projectData, isLoading: loadingDetails } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "campaign",
            campaign.id,
            "details"
        ],
        queryFn: {
            "AdminEditCampaignModal.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$projects$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProjectById"])(campaign.id)
        }["AdminEditCampaignModal.useQuery"]
    });
    const categoryOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AdminEditCampaignModal.useMemo[categoryOptions]": ()=>categories.map({
                "AdminEditCampaignModal.useMemo[categoryOptions]": (c)=>({
                        value: c.id,
                        label: c.name
                    })
            }["AdminEditCampaignModal.useMemo[categoryOptions]"])
    }["AdminEditCampaignModal.useMemo[categoryOptions]"], [
        categories
    ]);
    const selectedCategory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AdminEditCampaignModal.useMemo[selectedCategory]": ()=>{
            if (userCategory !== null) return userCategory;
            if (projectData?.category) {
                return {
                    value: projectData.category.id,
                    label: projectData.category.name
                };
            }
            if (projectData?.categoryId && categoryOptions.length > 0) {
                return categoryOptions.find({
                    "AdminEditCampaignModal.useMemo[selectedCategory]": (c)=>c.value === projectData.categoryId
                }["AdminEditCampaignModal.useMemo[selectedCategory]"]) || null;
            }
            return null;
        }
    }["AdminEditCampaignModal.useMemo[selectedCategory]"], [
        userCategory,
        projectData,
        categoryOptions
    ]);
    const selectedStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AdminEditCampaignModal.useMemo[selectedStatus]": ()=>{
            if (userStatus !== null) return userStatus;
            const current = projectData?.status || campaign.status;
            return STATUS_OPTIONS.find({
                "AdminEditCampaignModal.useMemo[selectedStatus]": (s)=>s.value === current
            }["AdminEditCampaignModal.useMemo[selectedStatus]"]) || STATUS_OPTIONS[0];
        }
    }["AdminEditCampaignModal.useMemo[selectedStatus]"], [
        userStatus,
        projectData?.status,
        campaign.status
    ]);
    const enableWebPortal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AdminEditCampaignModal.useMemo[enableWebPortal]": ()=>{
            if (userWebPortal !== null) return userWebPortal;
            return Boolean(projectData?.settings?.webPortalEnabled ?? campaign.settings?.webPortalEnabled);
        }
    }["AdminEditCampaignModal.useMemo[enableWebPortal]"], [
        userWebPortal,
        projectData?.settings?.webPortalEnabled,
        campaign.settings?.webPortalEnabled
    ]);
    function fail(message) {
        setError(message);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(message);
    }
    async function submit(event) {
        event.preventDefault();
        setError("");
        const form = new FormData(event.currentTarget);
        const name = String(form.get("name") || "").trim();
        const goal = String(form.get("goal") || "").trim();
        const startDate = String(form.get("startDate") || "").trim();
        const closing = String(form.get("closing") || "").trim();
        const location = String(form.get("location") || "").trim();
        const description = String(form.get("description") || "").trim();
        const commission = String(form.get("commission") || "").trim();
        const welcomeMessageInput = String(form.get("welcomeMessage") || "").trim();
        const acceptsContributions = form.get("acceptsContributions") === "on";
        if (name.length < 2) return fail("Campaign name must be at least 2 characters.");
        if (!/^\d+(\.\d{1,2})?$/.test(goal) || Number(goal) <= 0) {
            return fail("Please enter a valid fundraising goal in GH₵ (up to 2 decimals).");
        }
        if (closing && startDate && startDate > closing) {
            return fail("Start date cannot be after closing date.");
        }
        if (commission && (Number(commission) < 0 || Number(commission) > 100)) {
            return fail("Commission must be between 0 and 100%.");
        }
        const computedWelcome = welcomeMessageInput || (location ? `Welcome to ${name} (${location}). Dial 1 to contribute.` : `Welcome to ${name}. Dial 1 to contribute.`);
        const payload = {
            name,
            description: description || undefined,
            categoryId: selectedCategory?.value || undefined,
            targetAmount: Number(goal).toFixed(2),
            welcomeMessage: computedWelcome.slice(0, 120),
            startDate: startDate ? `${startDate}T00:00:00.000Z` : undefined,
            endDate: closing ? `${closing}T23:59:59.000Z` : undefined,
            commissionPercentage: commission ? Number(commission) : undefined,
            status: selectedStatus?.value || undefined,
            acceptsContributions,
            enableWebPortal
        };
        setSaving(true);
        try {
            const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$projects$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProject"])(campaign.id, payload);
            queryClient.invalidateQueries({
                queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$admin$2f$admin$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminRoot"]
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "projects"
                ]
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "campaign",
                    campaign.id
                ]
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Campaign "${name}" updated successfully!`);
            onUpdated(updated);
            onClose();
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const apiErr = err;
            const msg = apiErr?.response?.data?.message || apiErr?.message || "Could not update the campaign. Please check the fields and try again.";
            fail(msg);
        } finally{
            setSaving(false);
        }
    }
    const formId = "admin-edit-campaign-form";
    const initialGoal = projectData?.targetAmount ? Number(projectData.targetAmount).toFixed(2) : campaign.targetAmount ? Number(campaign.targetAmount).toFixed(2) : "";
    const initialStartDate = projectData?.startDate ? projectData.startDate.slice(0, 10) : "";
    const initialEndDate = projectData?.endDate ? projectData.endDate.slice(0, 10) : "";
    const initialCommission = projectData?.commissionPercentage !== undefined ? String(projectData.commissionPercentage) : campaign.commissionPercentage !== undefined ? String(campaign.commissionPercentage) : "14";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        title: `Edit Campaign: ${campaign.name}`,
        eyebrow: "Admin Campaign Editor",
        onClose: ()=>!saving && onClose(),
        footer: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-wrap items-center justify-end gap-3 w-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: onClose,
                    disabled: saving,
                    className: "rounded-xl border border-navy/20 bg-white px-4 py-2 text-sm font-medium hover:bg-stone disabled:opacity-50 transition-colors",
                    children: "Cancel"
                }, void 0, false, {
                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                    lineNumber: 179,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "submit",
                    form: formId,
                    disabled: saving || loadingDetails,
                    className: "inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2 text-sm font-medium text-white hover:bg-steel disabled:opacity-50 transition-colors shadow-sm",
                    children: saving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                size: 16,
                                className: "animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                lineNumber: 195,
                                columnNumber: 17
                            }, this),
                            "Saving changes..."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                        lineNumber: 194,
                        columnNumber: 15
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                lineNumber: 200,
                                columnNumber: 17
                            }, this),
                            "Save Changes"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                        lineNumber: 199,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                    lineNumber: 187,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
            lineNumber: 178,
            columnNumber: 9
        }, this),
        children: loadingDetails ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center py-12 text-center text-steel",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    size: 28,
                    className: "animate-spin text-navy"
                }, void 0, false, {
                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                    lineNumber: 210,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-3 text-sm font-medium text-navy",
                    children: "Loading campaign details..."
                }, void 0, false, {
                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                    lineNumber: 211,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
            lineNumber: 209,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            id: formId,
            onSubmit: submit,
            className: "space-y-4",
            children: [
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-xl border border-crimson/20 bg-crimson/5 p-3 text-xs text-crimson",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                    lineNumber: 216,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl bg-stone-light p-3 border border-navy/10 text-xs text-steel",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__["UserRound"], {
                                    size: 15,
                                    className: "text-steel shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                    lineNumber: 224,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block text-[10px] uppercase font-semibold tracking-wider text-steel",
                                            children: "Host"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                            lineNumber: 226,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-navy",
                                            children: campaign.hostName
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                            lineNumber: 227,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                    lineNumber: 225,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                            lineNumber: 223,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__["Hash"], {
                                    size: 15,
                                    className: "text-gold shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                    lineNumber: 231,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block text-[10px] uppercase font-semibold tracking-wider text-steel",
                                            children: "USSD Dial Code"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                            lineNumber: 233,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-mono font-bold text-navy",
                                            children: [
                                                "*920*969*",
                                                campaign.eventCode,
                                                "#"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                            lineNumber: 234,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                    lineNumber: 232,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                            lineNumber: 230,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                    lineNumber: 222,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "edit-name",
                            className: "text-xs font-semibold text-navy block mb-1",
                            children: [
                                "Campaign Name ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-crimson",
                                    children: "*"
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                    lineNumber: 242,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                            lineNumber: 241,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "edit-name",
                            name: "name",
                            required: true,
                            minLength: 2,
                            maxLength: 100,
                            defaultValue: projectData?.name || campaign.name,
                            placeholder: "e.g. Clean Water Initiative",
                            className: inputClass,
                            disabled: saving
                        }, void 0, false, {
                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                            lineNumber: 244,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                    lineNumber: 240,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-3 sm:grid-cols-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "edit-status",
                                    className: "text-xs font-semibold text-navy block mb-1",
                                    children: [
                                        "Campaign Status ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-crimson",
                                            children: "*"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                            lineNumber: 261,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                    lineNumber: 260,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$dist$2f$react$2d$select$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
                                    inputId: "edit-status",
                                    value: selectedStatus,
                                    onChange: (opt)=>setUserStatus(opt),
                                    options: STATUS_OPTIONS,
                                    styles: selectStyles,
                                    isSearchable: false,
                                    isDisabled: saving
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                    lineNumber: 263,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1 text-[11px] text-steel",
                                    children: [
                                        "Current: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "text-navy",
                                            children: campaign.status
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                            lineNumber: 273,
                                            columnNumber: 26
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                    lineNumber: 272,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                            lineNumber: 259,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "edit-commission",
                                    className: "text-xs font-semibold text-navy flex items-center justify-between mb-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Commission Fee (%)"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                            lineNumber: 279,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[11px] font-normal text-steel",
                                            children: "Standard: 14%"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                            lineNumber: 280,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                    lineNumber: 278,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "edit-commission",
                                            name: "commission",
                                            type: "number",
                                            min: "0",
                                            max: "100",
                                            step: "0.1",
                                            defaultValue: initialCommission,
                                            placeholder: "14",
                                            className: inputClass + " pr-8 font-semibold",
                                            disabled: saving
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                            lineNumber: 283,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-steel",
                                            children: "%"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                            lineNumber: 295,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                    lineNumber: 282,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1 text-[11px] text-steel",
                                    children: "Platform fee charged on contributions."
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                    lineNumber: 299,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                            lineNumber: 277,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                    lineNumber: 258,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-3 sm:grid-cols-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "edit-category",
                                    className: "text-xs font-semibold text-navy block mb-1",
                                    children: "Category"
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                    lineNumber: 308,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$dist$2f$react$2d$select$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
                                    inputId: "edit-category",
                                    value: selectedCategory,
                                    onChange: (opt)=>setUserCategory(opt),
                                    options: categoryOptions,
                                    placeholder: categoriesLoading ? "Loading..." : "Select category",
                                    styles: selectStyles,
                                    isClearable: true,
                                    isDisabled: saving || categoriesLoading
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                    lineNumber: 311,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                            lineNumber: 307,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "edit-goal",
                                    className: "text-xs font-semibold text-navy block mb-1",
                                    children: [
                                        "Fundraising Goal (GH₵) ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-crimson",
                                            children: "*"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                            lineNumber: 325,
                                            columnNumber: 40
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                    lineNumber: 324,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    id: "edit-goal",
                                    name: "goal",
                                    type: "number",
                                    min: "1",
                                    step: "0.01",
                                    required: true,
                                    defaultValue: initialGoal,
                                    placeholder: "10000.00",
                                    className: inputClass,
                                    disabled: saving
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                    lineNumber: 327,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                            lineNumber: 323,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                    lineNumber: 306,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-3 sm:grid-cols-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "edit-startDate",
                                    className: "text-xs font-semibold text-navy block mb-1",
                                    children: "Start Date"
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                    lineNumber: 345,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    id: "edit-startDate",
                                    name: "startDate",
                                    type: "date",
                                    defaultValue: initialStartDate,
                                    className: inputClass,
                                    disabled: saving
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                    lineNumber: 348,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                            lineNumber: 344,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "edit-closing",
                                    className: "text-xs font-semibold text-navy block mb-1",
                                    children: "Closing Date (Optional)"
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                    lineNumber: 359,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    id: "edit-closing",
                                    name: "closing",
                                    type: "date",
                                    defaultValue: initialEndDate,
                                    className: inputClass,
                                    disabled: saving
                                }, void 0, false, {
                                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                    lineNumber: 362,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                            lineNumber: 358,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                    lineNumber: 343,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "edit-welcomeMessage",
                            className: "text-xs font-semibold text-navy block mb-1",
                            children: "USSD Welcome Message (Max 120 chars)"
                        }, void 0, false, {
                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                            lineNumber: 375,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "edit-welcomeMessage",
                            name: "welcomeMessage",
                            maxLength: 120,
                            defaultValue: projectData?.welcomeMessage || "",
                            placeholder: `Welcome to ${campaign.name}. Dial 1 to contribute.`,
                            className: inputClass,
                            disabled: saving
                        }, void 0, false, {
                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                            lineNumber: 378,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1 text-[11px] text-steel",
                            children: [
                                "Greeting displayed to contributors when dialing *920*969*",
                                campaign.eventCode,
                                "#."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                            lineNumber: 387,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                    lineNumber: 374,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "edit-description",
                            className: "text-xs font-semibold text-navy block mb-1",
                            children: "Description (Optional)"
                        }, void 0, false, {
                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                            lineNumber: 394,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            id: "edit-description",
                            name: "description",
                            rows: 3,
                            defaultValue: projectData?.description || "",
                            placeholder: "Provide background information or purpose for this campaign...",
                            className: inputClass,
                            disabled: saving
                        }, void 0, false, {
                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                            lineNumber: 397,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                    lineNumber: 393,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 pt-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "checkbox",
                            id: "edit-acceptsContributions",
                            name: "acceptsContributions",
                            defaultChecked: projectData ? projectData.acceptsContributions : true,
                            className: "h-4 w-4 rounded accent-navy",
                            disabled: saving
                        }, void 0, false, {
                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                            lineNumber: 410,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "edit-acceptsContributions",
                            className: "text-xs font-medium text-navy cursor-pointer",
                            children: "Accept Contributions (Open for donations via USSD and Mobile Money)"
                        }, void 0, false, {
                            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                            lineNumber: 418,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                    lineNumber: 409,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-xl border border-navy/15 bg-stone-light/40 p-3.5 transition-colors hover:border-navy/30",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "edit-web-portal",
                        className: "flex items-start gap-3 cursor-pointer select-none",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "checkbox",
                                id: "edit-web-portal",
                                checked: enableWebPortal,
                                onChange: (e)=>setUserWebPortal(e.target.checked),
                                disabled: saving,
                                className: "mt-0.5 h-4 w-4 rounded accent-navy focus:ring-navy"
                            }, void 0, false, {
                                fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                lineNumber: 429,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-semibold text-navy",
                                                children: "Enable Online Web Donation Portal"
                                            }, void 0, false, {
                                                fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                                lineNumber: 439,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200",
                                                children: "+1% commission"
                                            }, void 0, false, {
                                                fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                                lineNumber: 442,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                        lineNumber: 438,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11px] text-steel leading-relaxed",
                                        children: "Attracts an additional 1% platform commission on web contributions. Gives donors a dedicated web portal to donate via Cards, Apple Pay, and Mobile Money."
                                    }, void 0, false, {
                                        fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                        lineNumber: 446,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                                lineNumber: 437,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                        lineNumber: 425,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
                    lineNumber: 424,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
            lineNumber: 214,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/features/admin/campaigns/AdminEditCampaignModal.tsx",
        lineNumber: 173,
        columnNumber: 5
    }, this);
}
_s(AdminEditCampaignModal, "w0rEHpDFxeuOrF25pWqDg2YWFrc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$host$2f$campaigns$2f$use$2d$campaigns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectCategoriesQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
_c = AdminEditCampaignModal;
var _c;
__turbopack_context__.k.register(_c, "AdminEditCampaignModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/features/admin/campaigns/campaign-status.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CampaignStatusBadge",
    ()=>CampaignStatusBadge,
    "ProgressBar",
    ()=>ProgressBar,
    "progressPercent",
    ()=>progressPercent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const styles = {
    ACTIVE: {
        label: "Active",
        className: "bg-[#e9f4ef] text-[#287754]"
    },
    SCHEDULED: {
        label: "Upcoming",
        className: "bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]"
    },
    PENDING_REVIEW: {
        label: "Pending Review",
        className: "bg-[#fff4dc] text-[#a26c12] border border-[#f0d696]/60"
    },
    REJECTED: {
        label: "Rejected",
        className: "bg-[#fbeaea] text-[#a13d3d] border border-crimson/20"
    },
    DRAFT: {
        label: "Draft",
        className: "bg-stone text-steel"
    },
    SUSPENDED: {
        label: "Suspended",
        className: "bg-[#fbeaea] text-[#a13d3d]"
    },
    COMPLETED: {
        label: "Completed",
        className: "bg-[#eaf0f8] text-[#234d79]"
    },
    ARCHIVED: {
        label: "Archived",
        className: "bg-stone text-steel"
    }
};
const LIVE_STATUSES = [
    "PUBLISHED",
    "APPROVED",
    "SCHEDULED"
];
/**
 * Live campaigns (published/approved/scheduled) are shown by their dates:
 * Completed once the end date has passed, Upcoming before the start date, otherwise Active.
 */ function displayStatus(status, startDate, endDate) {
    if (!LIVE_STATUSES.includes(status)) return status;
    const now = Date.now();
    if (endDate) {
        const end = new Date(endDate);
        // A date-only end date runs to the end of that day.
        if (end.getUTCHours() + end.getUTCMinutes() + end.getUTCSeconds() === 0) end.setUTCDate(end.getUTCDate() + 1);
        if (end.getTime() <= now) return "COMPLETED";
    }
    if (startDate && new Date(startDate).getTime() > now) return "SCHEDULED";
    return "ACTIVE";
}
function CampaignStatusBadge({ status, startDate, endDate }) {
    const shown = displayStatus(status, startDate, endDate);
    const { label, className } = styles[shown] ?? {
        label: shown,
        className: "bg-stone text-steel"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `rounded-full px-2.5 py-1 text-xs font-medium ${className}`,
        children: label
    }, void 0, false, {
        fileName: "[project]/components/features/admin/campaigns/campaign-status.tsx",
        lineNumber: 38,
        columnNumber: 10
    }, this);
}
_c = CampaignStatusBadge;
function progressPercent(raised, target) {
    const goal = Number(target);
    if (!goal || goal <= 0) return null;
    return Math.min(100, Math.round(Number(raised) / goal * 100));
}
function ProgressBar({ percent }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-1.5 w-full overflow-hidden rounded-full bg-stone",
        role: "progressbar",
        "aria-valuenow": percent,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-full rounded-full bg-gold",
            style: {
                width: `${percent}%`
            }
        }, void 0, false, {
            fileName: "[project]/components/features/admin/campaigns/campaign-status.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/features/admin/campaigns/campaign-status.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_c1 = ProgressBar;
var _c, _c1;
__turbopack_context__.k.register(_c, "CampaignStatusBadge");
__turbopack_context__.k.register(_c1, "ProgressBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConfigureStepsDrawer",
    ()=>ConfigureStepsDrawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2d$call$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PhoneCall$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone-call.mjs [app-client] (ecmascript) <export default as PhoneCall>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.mjs [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash.mjs [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.mjs [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/smartphone.mjs [app-client] (ecmascript) <export default as Smartphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$corner$2d$down$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CornerDownRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/corner-down-right.mjs [app-client] (ecmascript) <export default as CornerDownRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.mjs [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$host$2f$campaigns$2f$use$2d$ussd$2d$flow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/features/host/campaigns/use-ussd-flow.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ConfigureStepsDrawer({ campaign, open, onClose }) {
    _s();
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Lock body scroll when drawer is open
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConfigureStepsDrawer.useEffect": ()=>{
            if (!open) return;
            const previous = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return ({
                "ConfigureStepsDrawer.useEffect": ()=>{
                    document.body.style.overflow = previous;
                }
            })["ConfigureStepsDrawer.useEffect"];
        }
    }["ConfigureStepsDrawer.useEffect"], [
        open
    ]);
    // Escape key listener
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConfigureStepsDrawer.useEffect": ()=>{
            function onKeyDown(e) {
                if (e.key === "Escape" && open) {
                    onClose();
                }
            }
            window.addEventListener("keydown", onKeyDown);
            return ({
                "ConfigureStepsDrawer.useEffect": ()=>window.removeEventListener("keydown", onKeyDown)
            })["ConfigureStepsDrawer.useEffect"];
        }
    }["ConfigureStepsDrawer.useEffect"], [
        open,
        onClose
    ]);
    const { data: flowData, isLoading: isLoadingFlow } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$host$2f$campaigns$2f$use$2d$ussd$2d$flow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectUssdFlowQuery"])(campaign?.id);
    if (!open || !campaign) return null;
    const dialCode = campaign.eventCode ? `*920*969*${campaign.eventCode}#` : "*920*969#";
    function copyCode() {
        navigator.clipboard.writeText(dialCode);
        setCopied(true);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Copied dial string ${dialCode} to clipboard!`);
        setTimeout(()=>setCopied(false), 2000);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 overflow-hidden",
        role: "presentation",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                "aria-label": "Close configuration drawer",
                onClick: onClose,
                className: "fixed inset-0 h-full w-full cursor-default bg-midnight/55 backdrop-blur-[1px] transition-opacity duration-300"
            }, void 0, false, {
                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-y-0 right-0 flex max-w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-labelledby": "configure-steps-title",
                    className: "flex w-screen max-w-4xl flex-col bg-stone-light text-navy shadow-2xl animate-drawer border-l border-navy/10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between gap-4 border-b border-navy/10 bg-white p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 mb-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs font-semibold uppercase tracking-[0.16em] text-gold",
                                                    children: "USSD Dial Steps"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 113,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-steel",
                                                    children: "·"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 116,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs font-medium text-steel",
                                                    children: campaign.name
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 117,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 112,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            id: "configure-steps-title",
                                            className: "text-2xl font-medium tracking-tight",
                                            children: "Configure donor dial steps"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 119,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-steel",
                                            children: "Customize the exact menus, options, and sub-steps donors experience when dialing this campaign's code."
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 122,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-3 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "inline-flex items-center gap-1.5 rounded-lg bg-navy/5 px-3 py-1.5 text-xs font-mono font-semibold text-navy border border-navy/10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2d$call$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PhoneCall$3e$__["PhoneCall"], {
                                                            size: 13,
                                                            className: "text-gold"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 129,
                                                            columnNumber: 19
                                                        }, this),
                                                        dialCode
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 128,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: copyCode,
                                                    className: "inline-flex items-center gap-1 text-xs font-medium text-steel hover:text-navy transition-colors",
                                                    children: copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-emerald-700 flex items-center gap-1 font-semibold",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                size: 13
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                lineNumber: 139,
                                                                columnNumber: 23
                                                            }, this),
                                                            " Copied"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                        lineNumber: 138,
                                                        columnNumber: 21
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                size: 13
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                lineNumber: 143,
                                                                columnNumber: 23
                                                            }, this),
                                                            " Copy code"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                        lineNumber: 142,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 132,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 127,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                    lineNumber: 111,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onClose,
                                    "aria-label": "Close drawer",
                                    className: "shrink-0 rounded-lg p-2 text-steel hover:bg-stone transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 20,
                                        "aria-hidden": "true"
                                    }, void 0, false, {
                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                        lineNumber: 156,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                    lineNumber: 150,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                            lineNumber: 110,
                            columnNumber: 11
                        }, this),
                        isLoadingFlow ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-1 flex-col items-center justify-center py-20 text-center text-steel",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    size: 32,
                                    className: "animate-spin text-navy"
                                }, void 0, false, {
                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                    lineNumber: 162,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-3 text-sm font-medium text-navy",
                                    children: "Loading campaign USSD flow..."
                                }, void 0, false, {
                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                    lineNumber: 163,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1 text-xs text-steel",
                                    children: "Connecting to USSD runtime engine"
                                }, void 0, false, {
                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                    lineNumber: 164,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                            lineNumber: 161,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ConfigureStepsForm, {
                            campaign: campaign,
                            dialCode: dialCode,
                            flowData: flowData,
                            onClose: onClose
                        }, `${campaign.id}-${flowData?.version?.id || "initial"}`, false, {
                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                            lineNumber: 167,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                    lineNumber: 103,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
        lineNumber: 93,
        columnNumber: 5
    }, this);
}
_s(ConfigureStepsDrawer, "D1oRJnhWIGqNpFgtSvOXsU3o50c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$host$2f$campaigns$2f$use$2d$ussd$2d$flow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProjectUssdFlowQuery"]
    ];
});
_c = ConfigureStepsDrawer;
function ConfigureStepsForm({ campaign, dialCode, flowData, onClose }) {
    _s1();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("configure");
    // Step 1: Welcome & Purposes with nested sub-steps
    const [welcomePrompt, setWelcomePrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ConfigureStepsForm.useState": ()=>{
            const welcomeMenu = flowData?.version?.menus?.find({
                "ConfigureStepsForm.useState": (m)=>m.menuKey === "WELCOME"
            }["ConfigureStepsForm.useState"]);
            return welcomeMenu?.prompt || campaign.welcomeMessage || `Welcome to ${campaign.name}.\nSelect your donation purpose:`;
        }
    }["ConfigureStepsForm.useState"]);
    const [purposes, setPurposes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ConfigureStepsForm.useState": ()=>{
            const welcomeMenu = flowData?.version?.menus?.find({
                "ConfigureStepsForm.useState": (m)=>m.menuKey === "WELCOME"
            }["ConfigureStepsForm.useState"]);
            if (welcomeMenu?.options && welcomeMenu.options.length > 0) {
                const validOptions = welcomeMenu.options.filter({
                    "ConfigureStepsForm.useState.validOptions": (opt)=>opt.label !== "Exit"
                }["ConfigureStepsForm.useState.validOptions"]);
                if (validOptions.length > 0) {
                    return validOptions.map({
                        "ConfigureStepsForm.useState": (opt, i)=>{
                            let subSteps = [];
                            if (opt.targetMenuKey && opt.targetMenuKey.startsWith("SUB_PURPOSE_")) {
                                const subMenu = flowData?.version?.menus?.find({
                                    "ConfigureStepsForm.useState": (m)=>m.menuKey === opt.targetMenuKey
                                }["ConfigureStepsForm.useState"]);
                                if (subMenu?.options) {
                                    subSteps = subMenu.options.filter({
                                        "ConfigureStepsForm.useState": (subOpt)=>subOpt.label !== "Back"
                                    }["ConfigureStepsForm.useState"]).map({
                                        "ConfigureStepsForm.useState": (subOpt)=>subOpt.label
                                    }["ConfigureStepsForm.useState"]);
                                }
                            }
                            return {
                                id: `purpose-${i}-${Date.now()}`,
                                label: opt.label,
                                subSteps,
                                isExpanded: subSteps.length > 0
                            };
                        }
                    }["ConfigureStepsForm.useState"]);
                }
            }
            return [
                {
                    id: "p1",
                    label: "General Support",
                    subSteps: [],
                    isExpanded: false
                },
                {
                    id: "p2",
                    label: "Emergency Relief",
                    subSteps: [
                        "Medical Aid",
                        "Disaster Response"
                    ],
                    isExpanded: true
                },
                {
                    id: "p3",
                    label: "Project Operations",
                    subSteps: [],
                    isExpanded: false
                }
            ];
        }
    }["ConfigureStepsForm.useState"]);
    const [newPurposeInput, setNewPurposeInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [subStepInputs, setSubStepInputs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    // Step 2: Amount Prompt
    const [amountPrompt, setAmountPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ConfigureStepsForm.useState": ()=>{
            const amountMenu = flowData?.version?.menus?.find({
                "ConfigureStepsForm.useState": (m)=>m.menuKey === "AMOUNT_INPUT"
            }["ConfigureStepsForm.useState"]);
            return amountMenu?.prompt ?? `Enter Amount in ${campaign.currency || "GHS"} (e.g. 50):`;
        }
    }["ConfigureStepsForm.useState"]);
    // Step 3: Confirmation Prompt
    const [confirmPrompt, setConfirmPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ConfigureStepsForm.useState": ()=>{
            const confirmMenu = flowData?.version?.menus?.find({
                "ConfigureStepsForm.useState": (m)=>m.menuKey === "CONFIRM_PAYMENT"
            }["ConfigureStepsForm.useState"]);
            const raw = confirmMenu?.prompt;
            const fallback = `Contribute ${campaign.currency || "GHS"} {amount} to {purpose}?`;
            if (!raw) return fallback;
            let cleaned = raw;
            if (campaign?.name) {
                const escaped = campaign.name.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
                cleaned = cleaned.replace(new RegExp(`to\\s+${escaped}\\?`, "gi"), "to {purpose}?");
                cleaned = cleaned.replace(new RegExp(escaped, "gi"), "{purpose}");
            }
            cleaned = cleaned.replace(/{projectName}/g, "{purpose}");
            return cleaned;
        }
    }["ConfigureStepsForm.useState"]);
    const samplePurpose = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ConfigureStepsForm.useMemo[samplePurpose]": ()=>{
            for (const p of purposes){
                if (p.subSteps && p.subSteps.length > 0) {
                    return p.subSteps[0];
                }
            }
            return purposes[0]?.label || "Roofing";
        }
    }["ConfigureStepsForm.useMemo[samplePurpose]"], [
        purposes
    ]);
    // Step 4: OTP / PIN Prompt
    const [otpPrompt, setOtpPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ConfigureStepsForm.useState": ()=>{
            const otpMenu = flowData?.version?.menus?.find({
                "ConfigureStepsForm.useState": (m)=>m.menuKey === "ENTER_PAYMENT_OTP"
            }["ConfigureStepsForm.useState"]);
            return otpMenu?.prompt ?? "Enter your Mobile Money PIN or OTP to authorize payment:";
        }
    }["ConfigureStepsForm.useState"]);
    // Simulator state: 1 (Welcome) -> 1.5 (Sub-steps if any) -> 2 (Amount) -> 3 (Confirm) -> 4 (PIN) -> 5 (Done)
    const [simStep, setSimStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [simActivePurpose, setSimActivePurpose] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [simSelectedPurpose, setSimSelectedPurpose] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [simAmount, setSimAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [simInput, setSimInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const configureMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$host$2f$campaigns$2f$use$2d$ussd$2d$flow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConfigureProjectUssdFlowMutation"])();
    function handleAddPurpose(e) {
        e.preventDefault();
        const trimmed = newPurposeInput.trim();
        if (!trimmed) return;
        if (purposes.length >= 6) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("USSD menus can support up to 6 custom purposes to prevent screen pagination.");
            return;
        }
        if (purposes.some((p)=>p.label.toLowerCase() === trimmed.toLowerCase())) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("This purpose option already exists.");
            return;
        }
        setPurposes([
            ...purposes,
            {
                id: `p-${Date.now()}`,
                label: trimmed,
                subSteps: [],
                isExpanded: true
            }
        ]);
        setNewPurposeInput("");
    }
    function handleRemovePurpose(id) {
        if (purposes.length <= 1) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("A campaign must have at least one donation purpose option.");
            return;
        }
        setPurposes(purposes.filter((p)=>p.id !== id));
    }
    function toggleExpandPurpose(id) {
        setPurposes(purposes.map((p)=>p.id === id ? {
                ...p,
                isExpanded: !p.isExpanded
            } : p));
    }
    function handleAddSubStep(purposeId, e) {
        if (e) e.preventDefault();
        const rawVal = subStepInputs[purposeId] || "";
        const trimmed = rawVal.trim();
        if (!trimmed) return;
        const target = purposes.find((p)=>p.id === purposeId);
        if (!target) return;
        if (target.subSteps.length >= 5) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("USSD nested sub-steps can have up to 5 options per purpose.");
            return;
        }
        if (target.subSteps.some((s)=>s.toLowerCase() === trimmed.toLowerCase())) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("This sub-step option already exists under this purpose.");
            return;
        }
        setPurposes(purposes.map((p)=>p.id === purposeId ? {
                ...p,
                subSteps: [
                    ...p.subSteps,
                    trimmed
                ],
                isExpanded: true
            } : p));
        setSubStepInputs((prev)=>({
                ...prev,
                [purposeId]: ""
            }));
    }
    function handleRemoveSubStep(purposeId, subIndex) {
        setPurposes(purposes.map((p)=>p.id === purposeId ? {
                ...p,
                subSteps: p.subSteps.filter((_, idx)=>idx !== subIndex)
            } : p));
    }
    // Simulator step transitions
    function handleSimSend(e) {
        if (e) e.preventDefault();
        const val = simInput.trim();
        if (simStep === 1) {
            const idx = parseInt(val, 10) - 1;
            if (idx === purposes.length) {
                // Exit selected
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info("Session ended by donor.");
                resetSimulator();
                return;
            }
            if (isNaN(idx) || idx < 0 || idx >= purposes.length) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Please enter a number between 1 and ${purposes.length + 1}`);
                return;
            }
            const chosen = purposes[idx];
            setSimActivePurpose(chosen);
            // Check if chosen purpose has nested sub-steps
            if (chosen.subSteps && chosen.subSteps.length > 0) {
                setSimStep(1.5);
            } else {
                setSimSelectedPurpose(chosen.label);
                setSimStep(2);
            }
            setSimInput("");
        } else if (simStep === 1.5 && simActivePurpose) {
            const subIdx = parseInt(val, 10) - 1;
            const backOption = simActivePurpose.subSteps.length;
            if (subIdx === backOption) {
                // Back selected
                setSimStep(1);
                setSimActivePurpose(null);
                setSimInput("");
                return;
            }
            if (isNaN(subIdx) || subIdx < 0 || subIdx >= simActivePurpose.subSteps.length) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Please enter an option between 1 and ${simActivePurpose.subSteps.length + 1}`);
                return;
            }
            const chosenSub = simActivePurpose.subSteps[subIdx];
            setSimSelectedPurpose(chosenSub);
            setSimInput("");
            setSimStep(2);
        } else if (simStep === 2) {
            const num = parseFloat(val);
            if (isNaN(num) || num <= 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Please enter a valid amount (e.g. 20)");
                return;
            }
            setSimAmount(num.toFixed(2));
            setSimInput("");
            setSimStep(3);
        } else if (simStep === 3) {
            if (val === "1") {
                setSimInput("");
                setSimStep(4);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info("Donation cancelled in simulator.");
                resetSimulator();
            }
        } else if (simStep === 4) {
            if (val.length >= 4) {
                setSimStep(5);
                setSimInput("");
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Please enter a 4-digit PIN or OTP code (e.g. 1234)");
            }
        }
    }
    function resetSimulator() {
        setSimStep(1);
        setSimActivePurpose(null);
        setSimSelectedPurpose("");
        setSimAmount("");
        setSimInput("");
    }
    async function handleSave() {
        if (!welcomePrompt.trim()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("USSD Welcome Message is required.");
            return;
        }
        if (welcomePrompt.trim().length > 120) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("USSD Welcome Message cannot exceed 120 characters.");
            return;
        }
        if (purposes.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Please add at least one donation purpose option.");
            return;
        }
        try {
            await configureMutation.mutateAsync({
                projectId: campaign.id,
                input: {
                    welcomePrompt: welcomePrompt.trim(),
                    amountPrompt: amountPrompt.trim(),
                    confirmPrompt: confirmPrompt.trim(),
                    otpPrompt: otpPrompt.trim(),
                    currency: campaign.currency || "GHS",
                    purposes: purposes.map((p)=>({
                            label: p.label.trim(),
                            subSteps: p.subSteps.map((s)=>s.trim()).filter((s)=>s.length > 0)
                        }))
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`USSD dial steps updated and published! Dial ${dialCode} to test live routing.`);
            onClose();
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const apiErr = err;
            const msg = apiErr?.response?.data?.message || apiErr?.message || "Failed to update USSD dial steps.";
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(msg);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex border-b border-navy/10 bg-white px-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setActiveTab("configure"),
                        className: `flex items-center gap-2 border-b-2 py-3 px-1 text-sm font-medium transition-colors ${activeTab === "configure" ? "border-navy text-navy font-semibold" : "border-transparent text-steel hover:text-navy"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                lineNumber: 499,
                                columnNumber: 11
                            }, this),
                            "Step-by-step flow setup"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                        lineNumber: 491,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setActiveTab("simulator"),
                        className: `flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-medium transition-colors ${activeTab === "simulator" ? "border-navy text-navy font-semibold" : "border-transparent text-steel hover:text-navy"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"], {
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                lineNumber: 510,
                                columnNumber: 11
                            }, this),
                            "Interactive USSD simulator"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                        lineNumber: 502,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                lineNumber: 490,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto p-6 space-y-6",
                children: activeTab === "configure" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-xl border border-navy/10 bg-white p-4 shadow-sm",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-navy font-semibold text-xs",
                                        children: "4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                        lineNumber: 522,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-sm font-medium text-navy",
                                                children: "Dynamic USSD Flow with Sub-steps"
                                            }, void 0, false, {
                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                lineNumber: 526,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-0.5 text-xs text-steel leading-relaxed",
                                                children: [
                                                    "When a donor dials ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: dialCode
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                        lineNumber: 528,
                                                        columnNumber: 40
                                                    }, this),
                                                    ", they are guided through:",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                        lineNumber: 529,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold text-navy",
                                                        children: "1. Welcome & Purpose"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                        lineNumber: 530,
                                                        columnNumber: 21
                                                    }, this),
                                                    " (with optional nested sub-steps) →",
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold text-navy",
                                                        children: "2. Amount"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                        lineNumber: 531,
                                                        columnNumber: 21
                                                    }, this),
                                                    " →",
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold text-navy",
                                                        children: "3. Confirmation"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                        lineNumber: 532,
                                                        columnNumber: 21
                                                    }, this),
                                                    " →",
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold text-navy",
                                                        children: "4. Mobile Money PIN"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                        lineNumber: 533,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                lineNumber: 527,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                        lineNumber: 525,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                lineNumber: 521,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                            lineNumber: 520,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "rounded-xl border border-navy/10 bg-white p-5 shadow-sm space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-block rounded-md bg-navy/10 px-2 py-0.5 text-[11px] font-semibold text-navy uppercase tracking-wider",
                                                children: "Step 1"
                                            }, void 0, false, {
                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                lineNumber: 543,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "mt-1 text-base font-semibold text-navy",
                                                children: "USSD Welcome Message & Donation Purposes"
                                            }, void 0, false, {
                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                lineNumber: 546,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-steel",
                                                children: "Mandatory welcome greeting and donation menu options. You can add nested sub-steps under any option."
                                            }, void 0, false, {
                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                lineNumber: 547,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                        lineNumber: 542,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                    lineNumber: 541,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-xl bg-slate-50 border border-navy/10 p-4 space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between items-center text-xs text-steel",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "welcome-prompt",
                                                    className: "font-semibold text-navy flex items-center gap-1.5",
                                                    children: [
                                                        "USSD Welcome Message ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-crimson font-bold",
                                                            children: "*"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 557,
                                                            columnNumber: 42
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 556,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: !welcomePrompt.trim() || welcomePrompt.length > 120 ? "text-crimson font-semibold" : "",
                                                    children: [
                                                        welcomePrompt.length,
                                                        "/120 chars"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 559,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 555,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            id: "welcome-prompt",
                                            required: true,
                                            rows: 2,
                                            maxLength: 120,
                                            placeholder: `Welcome to ${campaign.name}.\nSelect your donation purpose:`,
                                            value: welcomePrompt,
                                            onChange: (e)=>setWelcomePrompt(e.target.value),
                                            className: "w-full rounded-xl border border-navy/20 bg-white px-3 py-2 text-sm text-navy focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 569,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] text-steel",
                                            children: [
                                                "Displayed on the donor's handset screen immediately upon dialing",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: dialCode
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 581,
                                                    columnNumber: 19
                                                }, this),
                                                ". Cannot be left blank."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 579,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                    lineNumber: 554,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs font-semibold text-navy block mb-2",
                                            children: "Donation Purposes & Sub-step Menus"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 587,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: [
                                                purposes.map((purpose, index)=>{
                                                    const hasSub = purpose.subSteps && purpose.subSteps.length > 0;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "rounded-xl border border-navy/10 bg-white p-3 shadow-xs space-y-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2.5 min-w-0 flex-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white",
                                                                                children: index + 1
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                lineNumber: 600,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-medium text-sm text-navy truncate",
                                                                                children: purpose.label
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                lineNumber: 603,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                        lineNumber: 599,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>toggleExpandPurpose(purpose.id),
                                                                                className: `inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${hasSub ? "bg-gold/15 text-navy hover:bg-gold/25 font-semibold" : "bg-navy/5 text-steel hover:text-navy hover:bg-navy/10"}`,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$corner$2d$down$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CornerDownRight$3e$__["CornerDownRight"], {
                                                                                        size: 12,
                                                                                        className: hasSub ? "text-gold" : ""
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                        lineNumber: 618,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        children: hasSub ? `${purpose.subSteps.length} sub-step${purpose.subSteps.length > 1 ? "s" : ""}` : "+ Sub-steps"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                        lineNumber: 619,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    purpose.isExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                                                                        size: 12
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                        lineNumber: 626,
                                                                                        columnNumber: 33
                                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                                        size: 12
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                        lineNumber: 628,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                lineNumber: 610,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>handleRemovePurpose(purpose.id),
                                                                                disabled: purposes.length <= 1,
                                                                                className: "text-steel hover:text-crimson disabled:opacity-30 transition-colors p-1",
                                                                                title: "Delete purpose",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                                    size: 14
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                    lineNumber: 639,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                lineNumber: 632,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                        lineNumber: 608,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                lineNumber: 598,
                                                                columnNumber: 25
                                                            }, this),
                                                            purpose.isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "ml-2 pl-4 border-l-2 border-navy/15 pt-1 space-y-2.5 bg-stone-light/60 p-3 rounded-lg",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center justify-between",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-[11px] font-medium text-steel",
                                                                                children: [
                                                                                    "Nested sub-choices for ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: purpose.label
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                        lineNumber: 649,
                                                                                        columnNumber: 56
                                                                                    }, this),
                                                                                    ":"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                lineNumber: 648,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[10px] text-steel",
                                                                                children: [
                                                                                    purpose.subSteps.length,
                                                                                    "/5 max"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                lineNumber: 651,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                        lineNumber: 647,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    purpose.subSteps.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "space-y-1.5",
                                                                        children: [
                                                                            purpose.subSteps.map((sub, sIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center justify-between gap-2 rounded-md bg-white border border-navy/10 px-2.5 py-1 text-xs text-navy",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "flex items-center gap-2 min-w-0",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "font-mono text-[10px] text-steel",
                                                                                                    children: [
                                                                                                        index + 1,
                                                                                                        ".",
                                                                                                        sIdx + 1
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                                    lineNumber: 664,
                                                                                                    columnNumber: 39
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "truncate",
                                                                                                    children: sub
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                                    lineNumber: 667,
                                                                                                    columnNumber: 39
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                            lineNumber: 663,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            type: "button",
                                                                                            onClick: ()=>handleRemoveSubStep(purpose.id, sIdx),
                                                                                            className: "text-steel hover:text-crimson transition-colors p-0.5",
                                                                                            title: "Remove sub-step",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                                                size: 12
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                                lineNumber: 675,
                                                                                                columnNumber: 39
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                            lineNumber: 669,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    ]
                                                                                }, sIdx, true, {
                                                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                    lineNumber: 659,
                                                                                    columnNumber: 35
                                                                                }, this)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-2 rounded-md border border-dashed border-navy/15 px-2.5 py-1 text-[11px] text-steel bg-white/40",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "font-mono text-[10px] text-navy font-bold",
                                                                                        children: [
                                                                                            index + 1,
                                                                                            ".",
                                                                                            purpose.subSteps.length + 1
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                        lineNumber: 682,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        children: "Back to main menu (Auto-generated)"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                        lineNumber: 685,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                lineNumber: 681,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                        lineNumber: 657,
                                                                        columnNumber: 31
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-[11px] text-steel italic",
                                                                        children: "No sub-steps configured yet. Selecting this purpose in Step 1 will proceed directly to the amount prompt."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                        lineNumber: 689,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex gap-2 pt-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "text",
                                                                                maxLength: 40,
                                                                                placeholder: "Add a sub-step (e.g. Medical Aid)",
                                                                                value: subStepInputs[purpose.id] || "",
                                                                                onChange: (e)=>setSubStepInputs({
                                                                                        ...subStepInputs,
                                                                                        [purpose.id]: e.target.value
                                                                                    }),
                                                                                onKeyDown: (e)=>{
                                                                                    if (e.key === "Enter") {
                                                                                        e.preventDefault();
                                                                                        handleAddSubStep(purpose.id);
                                                                                    }
                                                                                },
                                                                                className: "flex-1 rounded-lg border border-navy/15 bg-white px-2.5 py-1.5 text-xs text-navy placeholder:text-steel/60 focus:border-navy focus:outline-none"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                lineNumber: 696,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>handleAddSubStep(purpose.id),
                                                                                disabled: !(subStepInputs[purpose.id] || "").trim() || purpose.subSteps.length >= 5,
                                                                                className: "inline-flex items-center gap-1 rounded-lg bg-navy/90 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-navy disabled:opacity-40 transition-colors",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                                        size: 12
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                        lineNumber: 724,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    "Add sub-step"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                                lineNumber: 715,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                        lineNumber: 695,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                lineNumber: 646,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, purpose.id, true, {
                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                        lineNumber: 594,
                                                        columnNumber: 23
                                                    }, this);
                                                }),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 rounded-lg border border-dashed border-navy/15 px-3 py-2 text-xs text-steel bg-white/50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-mono font-bold text-navy",
                                                            children: [
                                                                purposes.length + 1,
                                                                "."
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 736,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Exit (Auto-generated system option)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 737,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 735,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 590,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                            onSubmit: handleAddPurpose,
                                            className: "mt-4 flex gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    maxLength: 40,
                                                    placeholder: "Add a new main purpose (e.g. Welfare Fund)",
                                                    value: newPurposeInput,
                                                    onChange: (e)=>setNewPurposeInput(e.target.value),
                                                    className: "flex-1 rounded-xl border border-navy/20 bg-white px-3 py-2 text-xs text-navy placeholder:text-steel/60 focus:border-navy focus:outline-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 743,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "submit",
                                                    disabled: !newPurposeInput.trim() || purposes.length >= 6,
                                                    className: "inline-flex items-center gap-1 rounded-xl bg-navy px-3 py-2 text-xs font-medium text-white hover:bg-steel disabled:opacity-40 transition-colors",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                            size: 14
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 756,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Add Option"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 751,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 742,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                    lineNumber: 586,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                            lineNumber: 540,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "rounded-xl border border-navy/10 bg-white p-5 shadow-sm space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-block rounded-md bg-navy/10 px-2 py-0.5 text-[11px] font-semibold text-navy uppercase tracking-wider",
                                            children: "Step 2"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 766,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "mt-1 text-base font-semibold text-navy",
                                            children: "Amount Input Screen"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 769,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-steel",
                                            children: "Prompts donor to enter their chosen contribution amount."
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 770,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                    lineNumber: 765,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between items-center text-xs text-steel mb-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "amount-prompt",
                                                    className: "font-medium text-navy",
                                                    children: [
                                                        "Prompt Text ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-crimson",
                                                            children: "*"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 778,
                                                            columnNumber: 33
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 777,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        amountPrompt.length,
                                                        "/120 chars"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 780,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 776,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "amount-prompt",
                                            type: "text",
                                            maxLength: 120,
                                            value: amountPrompt,
                                            onChange: (e)=>setAmountPrompt(e.target.value),
                                            className: "w-full rounded-xl border border-navy/20 bg-white px-3 py-2 text-sm text-navy focus:border-navy focus:outline-none"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 782,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1.5 text-[11px] text-steel",
                                            children: [
                                                "Limits: Minimum 1.00 ",
                                                campaign.currency || "GHS",
                                                " · Maximum 50,000.00 ",
                                                campaign.currency || "GHS"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 790,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                    lineNumber: 775,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                            lineNumber: 764,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "rounded-xl border border-navy/10 bg-white p-5 shadow-sm space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-block rounded-md bg-navy/10 px-2 py-0.5 text-[11px] font-semibold text-navy uppercase tracking-wider",
                                            children: "Step 3"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 799,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "mt-1 text-base font-semibold text-navy",
                                            children: "Confirmation Screen"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 802,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-steel",
                                            children: "Asks donor to review and confirm the selected amount before Mobile Money initiation."
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 803,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                    lineNumber: 798,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between items-center text-xs text-steel mb-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "confirm-prompt",
                                                    className: "font-medium text-navy",
                                                    children: [
                                                        "Confirmation Prompt ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-crimson",
                                                            children: "*"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 811,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 810,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        confirmPrompt.length,
                                                        "/120 chars"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 813,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 809,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "confirm-prompt",
                                            type: "text",
                                            maxLength: 120,
                                            value: confirmPrompt,
                                            onChange: (e)=>setConfirmPrompt(e.target.value),
                                            className: "w-full rounded-xl border border-navy/20 bg-white px-3 py-2 text-sm text-navy focus:border-navy focus:outline-none"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 815,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-[11px] text-steel",
                                            children: [
                                                "Tip: Use ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                    className: "bg-stone px-1 rounded text-navy",
                                                    children: "{amount}"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 824,
                                                    columnNumber: 28
                                                }, this),
                                                " for the donation amount and ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                    className: "bg-stone px-1 rounded text-navy",
                                                    children: "{purpose}"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 824,
                                                    columnNumber: 132
                                                }, this),
                                                ' to dynamically bind the selected step or sub-step (e.g. "',
                                                samplePurpose,
                                                '").'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 823,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-3 rounded-xl border border-navy/10 bg-slate-50 p-3 text-xs",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold text-steel block mb-1",
                                                    children: "Live Handset Preview:"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 829,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-lg border border-emerald-900/20 bg-[#0b1713] p-2.5 font-mono text-emerald-300",
                                                    children: confirmPrompt.replace(/{amount}/g, "50.00").replace(/{purpose}/g, samplePurpose).replace(/{subStep}/g, samplePurpose).replace(/{target}/g, samplePurpose).replace(/{step}/g, samplePurpose).replace(/{projectName}/g, samplePurpose).replace(/{currency}/g, campaign.currency || "GHS")
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 832,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1.5 text-[11px] text-steel",
                                                    children: [
                                                        "When the donor selects ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: [
                                                                '"',
                                                                samplePurpose,
                                                                '"'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 843,
                                                            columnNumber: 44
                                                        }, this),
                                                        ", it dynamically replaces ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                            children: "{purpose}"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 843,
                                                            columnNumber: 114
                                                        }, this),
                                                        " on their phone screen."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 842,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 828,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                    lineNumber: 808,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                            lineNumber: 797,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "rounded-xl border border-navy/10 bg-white p-5 shadow-sm space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-block rounded-md bg-navy/10 px-2 py-0.5 text-[11px] font-semibold text-navy uppercase tracking-wider",
                                            children: "Step 4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 852,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "mt-1 text-base font-semibold text-navy",
                                            children: "Payment Authorization Prompt"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 855,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-steel",
                                            children: "Final prompt instructing the donor to authorize the payment on their handset."
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 856,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                    lineNumber: 851,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between items-center text-xs text-steel mb-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "otp-prompt",
                                                    className: "font-medium text-navy",
                                                    children: [
                                                        "Authorization Prompt ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-crimson",
                                                            children: "*"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 864,
                                                            columnNumber: 42
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 863,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        otpPrompt.length,
                                                        "/120 chars"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 866,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 862,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: "otp-prompt",
                                            type: "text",
                                            maxLength: 120,
                                            value: otpPrompt,
                                            onChange: (e)=>setOtpPrompt(e.target.value),
                                            className: "w-full rounded-xl border border-navy/20 bg-white px-3 py-2 text-sm text-navy focus:border-navy focus:outline-none"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 868,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                    lineNumber: 861,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                            lineNumber: 850,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                    lineNumber: 518,
                    columnNumber: 11
                }, this) : /* Interactive USSD Mobile Phone Simulator with Sub-steps support */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center justify-center space-y-5 py-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center max-w-md",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-navy mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                            size: 13,
                                            className: "text-gold"
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 884,
                                            columnNumber: 17
                                        }, this),
                                        "Interactive Handset Simulator"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                    lineNumber: 883,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-navy",
                                    children: "Test your USSD Donor Flow"
                                }, void 0, false, {
                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                    lineNumber: 887,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-steel mt-1",
                                    children: [
                                        "See exactly how a donor on MTN, Telecel, or AT experiences your flow (including nested sub-steps) when dialing",
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: dialCode
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 890,
                                            columnNumber: 17
                                        }, this),
                                        "."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                    lineNumber: 888,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                            lineNumber: 882,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full max-w-[340px] rounded-[36px] bg-[#111827] p-4 shadow-2xl border-4 border-navy/30",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mx-auto mb-3 h-3 w-16 rounded-full bg-navy/60"
                                }, void 0, false, {
                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                    lineNumber: 897,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-h-[310px] rounded-2xl bg-[#0b1713] p-4 text-[#86efac] font-mono shadow-inner border border-emerald-900/60 flex flex-col justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between border-b border-emerald-900/50 pb-2 mb-3 text-[11px] text-emerald-400/80",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                "USSD: ",
                                                                dialCode
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 904,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "MTN MoMo"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 905,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 903,
                                                    columnNumber: 19
                                                }, this),
                                                simStep === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2 text-xs",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "whitespace-pre-line leading-relaxed font-semibold",
                                                            children: welcomePrompt || `Welcome to ${campaign.name}.\nSelect purpose:`
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 911,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-1 pt-1 text-emerald-300",
                                                            children: [
                                                                purposes.map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: [
                                                                            i + 1,
                                                                            ". ",
                                                                            p.label,
                                                                            p.subSteps && p.subSteps.length > 0 && " >"
                                                                        ]
                                                                    }, p.id, true, {
                                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                        lineNumber: 916,
                                                                        columnNumber: 27
                                                                    }, this)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-emerald-500",
                                                                    children: [
                                                                        purposes.length + 1,
                                                                        ". Exit"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                    lineNumber: 921,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 914,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 910,
                                                    columnNumber: 21
                                                }, this),
                                                simStep === 1.5 && simActivePurpose && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2 text-xs",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "leading-relaxed font-semibold text-emerald-300",
                                                            children: [
                                                                "Select ",
                                                                simActivePurpose.label,
                                                                ":"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 929,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-1 pt-1 text-emerald-300",
                                                            children: [
                                                                simActivePurpose.subSteps.map((sub, sIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: [
                                                                            sIdx + 1,
                                                                            ". ",
                                                                            sub
                                                                        ]
                                                                    }, sIdx, true, {
                                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                        lineNumber: 934,
                                                                        columnNumber: 27
                                                                    }, this)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-emerald-500",
                                                                    children: [
                                                                        simActivePurpose.subSteps.length + 1,
                                                                        ". Back"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                    lineNumber: 938,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 932,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 928,
                                                    columnNumber: 21
                                                }, this),
                                                simStep === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-3 text-xs",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-emerald-400 font-semibold truncate",
                                                            children: [
                                                                "Purpose: ",
                                                                simSelectedPurpose
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 948,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "leading-relaxed font-semibold",
                                                            children: amountPrompt || `Enter Amount in ${campaign.currency || "GHS"}:`
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 951,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 947,
                                                    columnNumber: 21
                                                }, this),
                                                simStep === 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-3 text-xs",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "leading-relaxed font-semibold",
                                                            children: confirmPrompt.replace(/{amount}/g, simAmount || "0.00").replace(/{purpose}/g, simSelectedPurpose || campaign.name).replace(/{subStep}/g, simSelectedPurpose || campaign.name).replace(/{target}/g, simSelectedPurpose || campaign.name).replace(/{step}/g, simSelectedPurpose || campaign.name).replace(/{projectName}/g, simSelectedPurpose || campaign.name).replace(/{currency}/g, campaign.currency || "GHS")
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 960,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-1 text-emerald-300",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: "1. Confirm & Pay"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                    lineNumber: 971,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: "2. Cancel"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                                    lineNumber: 972,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 970,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 959,
                                                    columnNumber: 21
                                                }, this),
                                                simStep === 4 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-3 text-xs",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "leading-relaxed font-semibold",
                                                            children: otpPrompt || "Enter Mobile Money PIN or OTP to authorize payment:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 980,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] text-emerald-400/80",
                                                            children: "(Enter any 4 digits to simulate approval)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 983,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 979,
                                                    columnNumber: 21
                                                }, this),
                                                simStep === 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "py-6 text-center space-y-3 text-xs text-emerald-300",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                            size: 36,
                                                            className: "mx-auto text-emerald-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 992,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold text-emerald-200",
                                                            children: "Payment Authorized!"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 993,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[11px] text-emerald-400/90 leading-relaxed",
                                                            children: [
                                                                "Thank you for contributing ",
                                                                simAmount,
                                                                " ",
                                                                campaign.currency || "GHS",
                                                                " to",
                                                                " ",
                                                                campaign.name,
                                                                " for ",
                                                                simSelectedPurpose,
                                                                "."
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                            lineNumber: 994,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 991,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 901,
                                            columnNumber: 17
                                        }, this),
                                        simStep < 5 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                            onSubmit: handleSimSend,
                                            className: "pt-3 border-t border-emerald-900/50 mt-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        autoFocus: true,
                                                        placeholder: simStep === 2 ? "e.g. 50" : "Option",
                                                        value: simInput,
                                                        onChange: (e)=>setSimInput(e.target.value),
                                                        className: "w-full rounded bg-emerald-950/60 px-2 py-1.5 text-xs text-emerald-200 placeholder:text-emerald-800 border border-emerald-800/60 focus:outline-none"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                        lineNumber: 1006,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "submit",
                                                        className: "rounded bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 transition-colors",
                                                        children: "Send"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                        lineNumber: 1014,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                lineNumber: 1005,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 1004,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: resetSimulator,
                                            className: "mt-4 flex w-full items-center justify-center gap-1.5 rounded bg-emerald-800/80 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                                    size: 13
                                                }, void 0, false, {
                                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                    lineNumber: 1028,
                                                    columnNumber: 21
                                                }, this),
                                                "Dial Again (",
                                                dialCode,
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                            lineNumber: 1023,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                    lineNumber: 900,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-3 flex justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: resetSimulator,
                                        className: "inline-flex items-center gap-1 text-[11px] text-steel hover:text-white transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                                size: 11
                                            }, void 0, false, {
                                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                                lineNumber: 1041,
                                                columnNumber: 19
                                            }, this),
                                            "Restart sequence"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                        lineNumber: 1036,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                    lineNumber: 1035,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                            lineNumber: 895,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                    lineNumber: 881,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                lineNumber: 516,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between border-t border-navy/10 bg-white p-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onClose,
                        disabled: configureMutation.isPending,
                        className: "rounded-xl border border-navy/20 bg-white px-5 py-2.5 text-sm font-medium hover:bg-stone disabled:opacity-50 transition-colors",
                        children: "Cancel"
                    }, void 0, false, {
                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                        lineNumber: 1052,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleSave,
                        disabled: configureMutation.isPending,
                        className: "inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-steel disabled:opacity-50 transition-colors",
                        children: [
                            configureMutation.isPending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                size: 16,
                                className: "animate-spin",
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                                lineNumber: 1068,
                                columnNumber: 13
                            }, this),
                            configureMutation.isPending ? "Publishing steps…" : "Save & Publish steps"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                        lineNumber: 1061,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
                lineNumber: 1051,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/features/host/campaigns/ConfigureStepsDrawer.tsx",
        lineNumber: 488,
        columnNumber: 5
    }, this);
}
_s1(ConfigureStepsForm, "84svq+CsIRicRT3CHhr2sAgcCqM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$features$2f$host$2f$campaigns$2f$use$2d$ussd$2d$flow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConfigureProjectUssdFlowMutation"]
    ];
});
_c1 = ConfigureStepsForm;
var _c, _c1;
__turbopack_context__.k.register(_c, "ConfigureStepsDrawer");
__turbopack_context__.k.register(_c1, "ConfigureStepsForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/features/host/campaigns/SpecialCodeField.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SpecialCodeField",
    ()=>SpecialCodeField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.mjs [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$projects$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/projects.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$debounced$2d$value$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-debounced-value.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const CODE_PATTERN = /^\d{2,4}$/;
function SpecialCodeField({ id, value, onChange, onStatusChange, disabled, label = "Special code", hint }) {
    _s();
    const debounced = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$debounced$2d$value$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebouncedValue"])(value);
    const isValid = CODE_PATTERN.test(value);
    const availability = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "projects",
            "code-availability",
            debounced
        ],
        queryFn: {
            "SpecialCodeField.useQuery[availability]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$projects$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkCodeAvailability"])(debounced)
        }["SpecialCodeField.useQuery[availability]"],
        enabled: CODE_PATTERN.test(debounced),
        staleTime: 0,
        retry: false
    });
    let status = "idle";
    if (value) {
        if (!isValid) status = "invalid";
        else if (debounced !== value || availability.isFetching) status = "checking";
        else if (availability.isError) status = "error";
        else if (availability.data === true) status = "available";
        else if (availability.data === false) status = "taken";
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SpecialCodeField.useEffect": ()=>{
            onStatusChange(status);
        }
    }["SpecialCodeField.useEffect"], [
        status,
        onStatusChange
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: id,
                className: "text-sm font-medium",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/features/host/campaigns/SpecialCodeField.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                id: id,
                type: "text",
                inputMode: "numeric",
                autoComplete: "off",
                maxLength: 4,
                value: value,
                disabled: disabled,
                onChange: (e)=>onChange(e.target.value.replace(/\D/g, "").slice(0, 4)),
                placeholder: "e.g. 777",
                "aria-describedby": `${id}-status`,
                "aria-invalid": status === "taken" || status === "invalid",
                className: "mt-2 w-36 rounded-lg border border-navy/20 bg-white px-3 py-2 font-mono text-sm font-semibold tracking-wider text-navy focus:border-navy focus:outline-none"
            }, void 0, false, {
                fileName: "[project]/components/features/host/campaigns/SpecialCodeField.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: `${id}-status`,
                role: "status",
                "aria-live": "polite",
                className: "mt-1.5 min-h-5 text-xs",
                children: [
                    status === "checking" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-1.5 text-steel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                size: 13,
                                className: "animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/components/features/host/campaigns/SpecialCodeField.tsx",
                                lineNumber: 79,
                                columnNumber: 13
                            }, this),
                            " Checking availability..."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/features/host/campaigns/SpecialCodeField.tsx",
                        lineNumber: 78,
                        columnNumber: 11
                    }, this),
                    status === "available" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-1.5 font-medium text-emerald-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                size: 13
                            }, void 0, false, {
                                fileName: "[project]/components/features/host/campaigns/SpecialCodeField.tsx",
                                lineNumber: 84,
                                columnNumber: 13
                            }, this),
                            " Code ",
                            value,
                            " is available."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/features/host/campaigns/SpecialCodeField.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this),
                    status === "taken" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-1.5 font-medium text-crimson",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                size: 13
                            }, void 0, false, {
                                fileName: "[project]/components/features/host/campaigns/SpecialCodeField.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this),
                            " Code ",
                            value,
                            " is already taken. Please choose another."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/features/host/campaigns/SpecialCodeField.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this),
                    status === "invalid" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-crimson",
                        children: "The code must be 2 to 4 digits."
                    }, void 0, false, {
                        fileName: "[project]/components/features/host/campaigns/SpecialCodeField.tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, this),
                    status === "error" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-crimson",
                        children: "Could not check this code. Please try again."
                    }, void 0, false, {
                        fileName: "[project]/components/features/host/campaigns/SpecialCodeField.tsx",
                        lineNumber: 96,
                        columnNumber: 11
                    }, this),
                    status === "idle" && hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-steel",
                        children: hint
                    }, void 0, false, {
                        fileName: "[project]/components/features/host/campaigns/SpecialCodeField.tsx",
                        lineNumber: 98,
                        columnNumber: 39
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/features/host/campaigns/SpecialCodeField.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/features/host/campaigns/SpecialCodeField.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_s(SpecialCodeField, "3ojycmC6EZGxfqTFy1A20RNwHok=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$debounced$2d$value$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebouncedValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
_c = SpecialCodeField;
var _c;
__turbopack_context__.k.register(_c, "SpecialCodeField");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/features/host/campaigns/use-campaigns.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeNextCampaignCode",
    ()=>computeNextCampaignCode,
    "projectToCampaign",
    ()=>projectToCampaign,
    "saveCampaign",
    ()=>saveCampaign,
    "useCampaign",
    ()=>useCampaign,
    "useCampaigns",
    ()=>useCampaigns,
    "useCampaignsList",
    ()=>useCampaignsList,
    "useCreateProjectMutation",
    ()=>useCreateProjectMutation,
    "useDeleteProjectMutation",
    ()=>useDeleteProjectMutation,
    "useNextCampaignCodeQuery",
    ()=>useNextCampaignCodeQuery,
    "useProjectCategoriesQuery",
    ()=>useProjectCategoriesQuery,
    "useProjectStatsQuery",
    ()=>useProjectStatsQuery,
    "useProjectsQuery",
    ()=>useProjectsQuery,
    "useUpdateProjectMutation",
    ()=>useUpdateProjectMutation,
    "useUpdateProjectStatusMutation",
    ()=>useUpdateProjectStatusMutation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$projects$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/projects.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature(), _s10 = __turbopack_context__.k.signature();
"use client";
;
;
;
function projectToCampaign(project) {
    const goalInPesewas = project.targetAmount ? Math.round(parseFloat(project.targetAmount) * 100) : 0;
    const raisedInPesewas = project.totalRaised ? Math.round(parseFloat(project.totalRaised) * 100) : 0;
    const contributors = project.contributorsCount ?? 0;
    const statusMap = {
        DRAFT: "Draft",
        PENDING_REVIEW: "Draft",
        APPROVED: "Active",
        SCHEDULED: "Upcoming",
        PUBLISHED: "Active",
        REJECTED: "Draft",
        SUSPENDED: "Draft",
        COMPLETED: "Completed",
        ARCHIVED: "Completed"
    };
    const now = new Date();
    const hasFutureStartDate = Boolean(project.startDate && new Date(project.startDate) > now);
    let resolvedStatus = statusMap[project.status] || "Active";
    if (project.status === "APPROVED" || project.status === "PUBLISHED" || project.status === "SCHEDULED") {
        // Start date decides: SCHEDULED stays Upcoming only until the start date is reached.
        resolvedStatus = hasFutureStartDate ? "Upcoming" : "Active";
    }
    return {
        id: project.id,
        name: project.name,
        slug: project.slug || undefined,
        eventCode: project.eventCode,
        location: project.welcomeMessage || "Ghana",
        category: project.category?.name || "General Fundraising",
        description: project.description || "",
        goal: goalInPesewas,
        raised: raisedInPesewas,
        contributors,
        commissionPercentage: project.commissionPercentage ? parseFloat(String(project.commissionPercentage)) : 14,
        status: resolvedStatus,
        rawStatus: project.status,
        created: project.createdAt ? project.createdAt.slice(0, 10) : "",
        closing: project.endDate ? project.endDate.slice(0, 10) : "",
        startDate: project.startDate ? project.startDate.slice(0, 10) : undefined,
        welcomeMessage: project.welcomeMessage || undefined,
        currency: project.currency,
        acceptsContributions: project.acceptsContributions,
        settings: project.settings
    };
}
function useProjectsQuery(params) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "projects",
            params
        ],
        queryFn: {
            "useProjectsQuery.useQuery": async ()=>{
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$projects$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProjects"])(params);
                return result.projects;
            }
        }["useProjectsQuery.useQuery"],
        staleTime: 5_000,
        refetchInterval: 10_000
    });
}
_s(useProjectsQuery, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useProjectCategoriesQuery() {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "project-categories"
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$projects$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProjectCategories"],
        staleTime: 60_000
    });
}
_s1(useProjectCategoriesQuery, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function computeNextCampaignCode(campaignsOrProjects) {
    for (const item of campaignsOrProjects){
        const code = item.eventCode?.trim();
        if (code && /^\d{4}$/.test(code)) {
            const num = parseInt(code, 10);
            if (!isNaN(num) && num >= 1000 && num <= 9999) {
                return (num + 1).toString();
            }
        }
    }
    const numericCodes = campaignsOrProjects.map((c)=>parseInt(c.eventCode || "", 10)).filter((n)=>!isNaN(n) && n >= 1000 && n <= 9999);
    if (numericCodes.length > 0) {
        return (Math.max(...numericCodes) + 1).toString();
    }
    return "1001";
}
function useNextCampaignCodeQuery(enabled = true) {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "projects",
            "next-code"
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$projects$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNextProjectCode"],
        enabled,
        staleTime: 0
    });
}
_s2(useNextCampaignCodeQuery, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useProjectStatsQuery() {
    _s3();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "projects",
            "stats"
        ],
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$projects$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProjectStats"],
        staleTime: 5_000,
        refetchInterval: 10_000
    });
}
_s3(useProjectStatsQuery, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCampaignsList(params) {
    _s4();
    const query = useProjectsQuery(params);
    const campaigns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useCampaignsList.useMemo[campaigns]": ()=>{
            return (query.data || []).map(projectToCampaign);
        }
    }["useCampaignsList.useMemo[campaigns]"], [
        query.data
    ]);
    return {
        ...query,
        campaigns,
        backendCount: campaigns.length
    };
}
_s4(useCampaignsList, "pQTat68GpAWn5oheJJWsNQF2kRc=", false, function() {
    return [
        useProjectsQuery
    ];
});
function useCampaigns() {
    _s5();
    const { campaigns } = useCampaignsList();
    return campaigns;
}
_s5(useCampaigns, "rKwFS6cgyCTEVWOyu3jRIFgEEGg=", false, function() {
    return [
        useCampaignsList
    ];
});
function useCampaign(id) {
    _s6();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "project",
            id
        ],
        queryFn: {
            "useCampaign.useQuery": async ()=>{
                const project = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$projects$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProjectById"])(id);
                return projectToCampaign(project);
            }
        }["useCampaign.useQuery"],
        enabled: Boolean(id && id.length > 10)
    });
}
_s6(useCampaign, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useCreateProjectMutation() {
    _s7();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateProjectMutation.useMutation": (input)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$projects$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createProject"])(input)
        }["useCreateProjectMutation.useMutation"],
        onSuccess: {
            "useCreateProjectMutation.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        "projects"
                    ]
                });
            }
        }["useCreateProjectMutation.useMutation"]
    });
}
_s7(useCreateProjectMutation, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateProjectStatusMutation() {
    _s8();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateProjectStatusMutation.useMutation": ({ id, status, notes })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$projects$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProjectStatus"])(id, status, notes)
        }["useUpdateProjectStatusMutation.useMutation"],
        onSuccess: {
            "useUpdateProjectStatusMutation.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        "projects"
                    ]
                });
            }
        }["useUpdateProjectStatusMutation.useMutation"]
    });
}
_s8(useUpdateProjectStatusMutation, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUpdateProjectMutation() {
    _s9();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateProjectMutation.useMutation": ({ id, input })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$projects$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProject"])(id, input)
        }["useUpdateProjectMutation.useMutation"],
        onSuccess: {
            "useUpdateProjectMutation.useMutation": (_, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        "projects"
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "project",
                        variables.id
                    ]
                });
            }
        }["useUpdateProjectMutation.useMutation"]
    });
}
_s9(useUpdateProjectMutation, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteProjectMutation() {
    _s10();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteProjectMutation.useMutation": (id)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$projects$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteProject"])(id)
        }["useDeleteProjectMutation.useMutation"],
        onSuccess: {
            "useDeleteProjectMutation.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        "projects"
                    ]
                });
            }
        }["useDeleteProjectMutation.useMutation"]
    });
}
_s10(useDeleteProjectMutation, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
async function saveCampaign(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$projects$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createProject"])(input);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/features/host/campaigns/use-ussd-flow.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useConfigureProjectUssdFlowMutation",
    ()=>useConfigureProjectUssdFlowMutation,
    "useProjectUssdFlowQuery",
    ()=>useProjectUssdFlowQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$ussd$2d$flows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/ussd-flows.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
function useProjectUssdFlowQuery(projectId) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "ussd-flow",
            projectId
        ],
        queryFn: {
            "useProjectUssdFlowQuery.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$ussd$2d$flows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProjectUssdFlow"])(projectId)
        }["useProjectUssdFlowQuery.useQuery"],
        enabled: Boolean(projectId),
        staleTime: 0,
        refetchOnMount: "always"
    });
}
_s(useProjectUssdFlowQuery, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useConfigureProjectUssdFlowMutation() {
    _s1();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useConfigureProjectUssdFlowMutation.useMutation": ({ projectId, input })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$ussd$2d$flows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["configureProjectUssdFlow"])(projectId, input)
        }["useConfigureProjectUssdFlowMutation.useMutation"],
        onSuccess: {
            "useConfigureProjectUssdFlowMutation.useMutation": (_, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        "ussd-flow",
                        variables.projectId
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "projects"
                    ]
                });
                queryClient.invalidateQueries({
                    queryKey: [
                        "admin"
                    ]
                });
            }
        }["useConfigureProjectUssdFlowMutation.useMutation"]
    });
}
_s1(useConfigureProjectUssdFlowMutation, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/MetricCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MetricCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
/** Accent tints are derived from the RaiseFundz palette, not arbitrary colors. */ const accents = {
    green: "bg-lime/20 text-lime-dark",
    blue: "bg-navy/10 text-navy",
    gold: "bg-gold/15 text-gold",
    purple: "bg-steel/10 text-steel"
};
function MetricCard({ label, value, detail, icon: Icon, accent }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "group surface-card rounded-none p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-semibold uppercase tracking-[0.1em] text-steel",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/components/ui/MetricCard.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-none transition-transform duration-200 group-hover:scale-105 ${accents[accent]}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                            size: 18,
                            "aria-hidden": "true"
                        }, void 0, false, {
                            fileName: "[project]/components/ui/MetricCard.tsx",
                            lineNumber: 28,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ui/MetricCard.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/MetricCard.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-4 text-[1.75rem] font-semibold leading-none tracking-tight text-navy",
                children: value
            }, void 0, false, {
                fileName: "[project]/components/ui/MetricCard.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            detail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2.5 text-xs leading-relaxed text-steel",
                children: detail
            }, void 0, false, {
                fileName: "[project]/components/ui/MetricCard.tsx",
                lineNumber: 34,
                columnNumber: 18
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/MetricCard.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_c = MetricCard;
var _c;
__turbopack_context__.k.register(_c, "MetricCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/Modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Modal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const SIZE_CLASSES = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl"
};
function Modal({ title, eyebrow, onClose, children, footer, size = "2xl", className }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Modal.useEffect": ()=>{
            const onKey = {
                "Modal.useEffect.onKey": (event)=>{
                    if (event.key === "Escape") onClose();
                }
            }["Modal.useEffect.onKey"];
            const previous = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            document.addEventListener("keydown", onKey);
            return ({
                "Modal.useEffect": ()=>{
                    document.body.style.overflow = previous;
                    document.removeEventListener("keydown", onKey);
                }
            })["Modal.useEffect"];
        }
    }["Modal.useEffect"], [
        onClose
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-end justify-center bg-midnight/50 p-0 backdrop-blur-sm sm:items-center sm:p-4",
        role: "presentation",
        onMouseDown: (event)=>{
            if (event.target === event.currentTarget) onClose();
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            role: "dialog",
            "aria-modal": "true",
            "aria-label": title,
            className: `flex max-h-[calc(100vh-2rem)] w-full ${SIZE_CLASSES[size] ?? "max-w-2xl"} flex-col overflow-hidden rounded-0 bg-white shadow-2xl ${className ?? ""}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start justify-between gap-4 border-b border-navy/10 px-5 py-4 sm:px-6 sm:py-5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                eyebrow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-eyebrow text-gold",
                                    children: eyebrow
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/Modal.tsx",
                                    lineNumber: 67,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "mt-1 text-lg font-semibold tracking-tight text-navy sm:text-xl",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/Modal.tsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ui/Modal.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onClose,
                            "aria-label": "Close dialog",
                            className: "rounded-full p-1.5 text-steel transition-colors hover:bg-stone hover:text-navy",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/components/ui/Modal.tsx",
                                lineNumber: 76,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/ui/Modal.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/Modal.tsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-y-auto px-5 py-5 sm:px-6",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/ui/Modal.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this),
                footer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-t border-navy/10 bg-stone-light px-5 py-3.5 sm:px-6",
                    children: footer
                }, void 0, false, {
                    fileName: "[project]/components/ui/Modal.tsx",
                    lineNumber: 81,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/Modal.tsx",
            lineNumber: 59,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/Modal.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_s(Modal, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = Modal;
var _c;
__turbopack_context__.k.register(_c, "Modal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/Pagination.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PAGE_SIZE",
    ()=>PAGE_SIZE,
    "default",
    ()=>Pagination
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.mjs [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-client] (ecmascript) <export default as ChevronRight>");
;
;
const PAGE_SIZE = 10;
const buttonClass = "inline-flex items-center gap-1 rounded-lg border border-navy/15 bg-white px-2.5 py-1.5 text-xs font-semibold text-steel transition-colors hover:bg-stone hover:text-navy disabled:cursor-not-allowed disabled:opacity-40";
function Pagination({ page, totalPages, total, pageSize = PAGE_SIZE, label, onPageChange }) {
    if (totalPages <= 1) return null;
    const first = (page - 1) * pageSize + 1;
    const last = Math.min(page * pageSize, total);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-3 border-t border-navy/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-steel",
                children: [
                    "Showing ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-semibold text-navy",
                        children: [
                            first,
                            "–",
                            last
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/Pagination.tsx",
                        lineNumber: 27,
                        columnNumber: 17
                    }, this),
                    " of ",
                    total,
                    " ",
                    label
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/Pagination.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        disabled: page <= 1,
                        onClick: ()=>onPageChange(page - 1),
                        className: buttonClass,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                size: 14,
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/Pagination.tsx",
                                lineNumber: 31,
                                columnNumber: 11
                            }, this),
                            " Previous"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/Pagination.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded-full bg-stone px-3 py-1 text-xs font-semibold text-navy",
                        children: [
                            page,
                            " / ",
                            totalPages
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/Pagination.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        disabled: page >= totalPages,
                        onClick: ()=>onPageChange(page + 1),
                        className: buttonClass,
                        children: [
                            "Next ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                size: 14,
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/Pagination.tsx",
                                lineNumber: 37,
                                columnNumber: 16
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/Pagination.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/Pagination.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/Pagination.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_c = Pagination;
var _c;
__turbopack_context__.k.register(_c, "Pagination");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/QueryState.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorNote",
    ()=>ErrorNote,
    "Skeleton",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs [app-client] (ecmascript) <export default as RefreshCw>");
;
;
function Skeleton({ className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "aria-hidden": true,
        className: `animate-pulse rounded-xl bg-navy/10 ${className}`
    }, void 0, false, {
        fileName: "[project]/components/ui/QueryState.tsx",
        lineNumber: 4,
        columnNumber: 10
    }, this);
}
_c = Skeleton;
function ErrorNote({ message, onRetry }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "alert",
        className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-crimson/20 bg-crimson/5 px-4 py-3.5 text-sm text-crimson",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex items-center gap-2.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                        size: 16,
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/QueryState.tsx",
                        lineNumber: 14,
                        columnNumber: 9
                    }, this),
                    message ?? "Something went wrong loading this."
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/QueryState.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            onRetry && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onRetry,
                className: "inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-crimson shadow-sm transition-colors hover:bg-crimson/10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                        size: 13,
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/QueryState.tsx",
                        lineNumber: 23,
                        columnNumber: 11
                    }, this),
                    "Retry"
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/QueryState.tsx",
                lineNumber: 18,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/QueryState.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c1 = ErrorNote;
var _c, _c1;
__turbopack_context__.k.register(_c, "Skeleton");
__turbopack_context__.k.register(_c1, "ErrorNote");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/RowMenu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RowMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.mjs [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const MENU_WIDTH = 176;
function RowMenu({ label, items }) {
    _s();
    const button = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const menu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RowMenu.useEffect": ()=>{
            if (!position) return;
            const close = {
                "RowMenu.useEffect.close": ()=>setPosition(null)
            }["RowMenu.useEffect.close"];
            const onPointer = {
                "RowMenu.useEffect.onPointer": (event)=>{
                    const target = event.target;
                    if (!menu.current?.contains(target) && !button.current?.contains(target)) close();
                }
            }["RowMenu.useEffect.onPointer"];
            const onKey = {
                "RowMenu.useEffect.onKey": (event)=>{
                    if (event.key === "Escape") close();
                }
            }["RowMenu.useEffect.onKey"];
            document.addEventListener("mousedown", onPointer);
            document.addEventListener("keydown", onKey);
            window.addEventListener("resize", close);
            window.addEventListener("scroll", close, true);
            return ({
                "RowMenu.useEffect": ()=>{
                    document.removeEventListener("mousedown", onPointer);
                    document.removeEventListener("keydown", onKey);
                    window.removeEventListener("resize", close);
                    window.removeEventListener("scroll", close, true);
                }
            })["RowMenu.useEffect"];
        }
    }["RowMenu.useEffect"], [
        position
    ]);
    function toggle(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (position) return setPosition(null);
        const rect = button.current.getBoundingClientRect();
        const height = items.length * 36 + 12;
        // Flip upward when there is no room below the button.
        const top = rect.bottom + height > window.innerHeight ? rect.top - height - 4 : rect.bottom + 4;
        setPosition({
            top,
            left: Math.max(8, rect.right - MENU_WIDTH)
        });
    }
    if (items.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                ref: button,
                type: "button",
                "aria-label": label,
                "aria-haspopup": "menu",
                "aria-expanded": position !== null,
                onClick: toggle,
                className: "rounded-lg p-1.5 text-steel transition-colors hover:bg-stone hover:text-navy focus:outline-none focus:ring-1 focus:ring-navy/20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                    size: 18
                }, void 0, false, {
                    fileName: "[project]/components/ui/RowMenu.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ui/RowMenu.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            position && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: menu,
                role: "menu",
                style: {
                    top: position.top,
                    left: position.left,
                    width: MENU_WIDTH
                },
                className: "fixed z-50 rounded-xl border border-navy/10 bg-white py-1.5 text-left shadow-xl",
                onClick: (e)=>e.stopPropagation(),
                children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        role: "menuitem",
                        onClick: (e)=>{
                            e.preventDefault();
                            e.stopPropagation();
                            setPosition(null);
                            item.onSelect();
                        },
                        className: `flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs font-medium transition-colors hover:bg-stone ${item.danger ? "text-crimson hover:bg-crimson/5" : "text-navy"}`,
                        children: [
                            item.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "shrink-0",
                                children: item.icon
                            }, void 0, false, {
                                fileName: "[project]/components/ui/RowMenu.tsx",
                                lineNumber: 105,
                                columnNumber: 31
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: item.label
                            }, void 0, false, {
                                fileName: "[project]/components/ui/RowMenu.tsx",
                                lineNumber: 106,
                                columnNumber: 17
                            }, this)
                        ]
                    }, item.label, true, {
                        fileName: "[project]/components/ui/RowMenu.tsx",
                        lineNumber: 91,
                        columnNumber: 15
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/ui/RowMenu.tsx",
                lineNumber: 83,
                columnNumber: 11
            }, this), document.body)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/RowMenu.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
_s(RowMenu, "WRukin961qWhiNt8RVzBs6YGSH4=");
_c = RowMenu;
var _c;
__turbopack_context__.k.register(_c, "RowMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/selectStyles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSelectStyles",
    ()=>getSelectStyles
]);
function getSelectStyles(options) {
    const minHeight = options?.minHeight ?? "46px";
    const defaultBorder = options?.borderColor ?? "rgba(11, 37, 69, 0.15)";
    return {
        control: (base, state)=>({
                ...base,
                backgroundColor: "#ffffff",
                borderColor: state.isFocused ? "#0b2545" : defaultBorder,
                borderRadius: "0.75rem",
                minHeight,
                boxShadow: state.isFocused ? "0 0 0 1px #0b2545" : "none",
                "&:hover": {
                    borderColor: state.isFocused ? "#0b2545" : "rgba(11, 37, 69, 0.3)"
                },
                cursor: "pointer",
                fontSize: "0.875rem",
                transition: "all 150ms ease"
            }),
        valueContainer: (base)=>({
                ...base,
                padding: "0 12px"
            }),
        singleValue: (base)=>({
                ...base,
                color: "#0b2545",
                fontWeight: 500
            }),
        placeholder: (base)=>({
                ...base,
                color: "#2e4c6d",
                opacity: 0.6
            }),
        input: (base)=>({
                ...base,
                color: "#0b2545",
                margin: 0,
                padding: 0
            }),
        menu: (base)=>({
                ...base,
                backgroundColor: "#ffffff",
                borderRadius: "0.75rem",
                overflow: "hidden",
                boxShadow: "0 10px 25px -5px rgba(11, 37, 69, 0.1), 0 8px 10px -6px rgba(11, 37, 69, 0.05)",
                border: "1px solid rgba(11, 37, 69, 0.1)",
                zIndex: 9999
            }),
        menuList: (base)=>({
                ...base,
                padding: "4px"
            }),
        option: (base, state)=>({
                ...base,
                backgroundColor: state.isSelected ? "#0b2545" : state.isFocused ? "rgba(11, 37, 69, 0.05)" : "#ffffff",
                color: state.isSelected ? "#ffffff" : "#0b2545",
                borderRadius: "0.5rem",
                margin: "2px 0",
                fontSize: "0.875rem",
                cursor: "pointer",
                "&:active": {
                    backgroundColor: "#0b2545",
                    color: "#ffffff"
                }
            }),
        dropdownIndicator: (base, state)=>({
                ...base,
                color: state.isFocused ? "#0b2545" : "#2e4c6d",
                padding: "0 8px",
                "&:hover": {
                    color: "#0b2545"
                }
            }),
        clearIndicator: (base)=>({
                ...base,
                color: "#2e4c6d",
                padding: "0 6px",
                cursor: "pointer",
                "&:hover": {
                    color: "#a13d3d"
                }
            }),
        indicatorSeparator: ()=>({
                display: "none"
            })
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-debounced-value.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDebouncedValue",
    ()=>useDebouncedValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function useDebouncedValue(value, delay = 350) {
    _s();
    const [debounced, setDebounced] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(value);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDebouncedValue.useEffect": ()=>{
            const timer = setTimeout({
                "useDebouncedValue.useEffect.timer": ()=>setDebounced(value)
            }["useDebouncedValue.useEffect.timer"], delay);
            return ({
                "useDebouncedValue.useEffect": ()=>clearTimeout(timer)
            })["useDebouncedValue.useEffect"];
        }
    }["useDebouncedValue.useEffect"], [
        value,
        delay
    ]);
    return debounced;
}
_s(useDebouncedValue, "33bQBlXg6j7MFSTRBeGy5/ui5G8=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api/projects.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkCodeAvailability",
    ()=>checkCodeAvailability,
    "createProject",
    ()=>createProject,
    "deleteProject",
    ()=>deleteProject,
    "getNextProjectCode",
    ()=>getNextProjectCode,
    "getProjectById",
    ()=>getProjectById,
    "getProjectCategories",
    ()=>getProjectCategories,
    "getProjectStats",
    ()=>getProjectStats,
    "getProjects",
    ()=>getProjects,
    "updateProject",
    ()=>updateProject,
    "updateProjectStatus",
    ()=>updateProjectStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/client.ts [app-client] (ecmascript)");
;
async function getProjects(params) {
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/projects", {
        params
    });
    return {
        projects: data.data ?? [],
        meta: data.meta ?? {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 1
        }
    };
}
async function getProjectById(id) {
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/projects/${id}`);
    return data.data;
}
async function createProject(input) {
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/projects", input);
    return data.data;
}
async function updateProject(id, input) {
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put(`/projects/${id}`, input);
    return data.data;
}
async function deleteProject(id) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(`/projects/${id}`);
}
async function getProjectCategories() {
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/projects/categories");
    return data.data ?? [];
}
async function getNextProjectCode() {
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/projects/next-code");
    return data.data?.code || "1001";
}
async function checkCodeAvailability(code) {
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/projects/code-availability", {
        params: {
            code
        }
    });
    return data.data.available;
}
async function updateProjectStatus(id, status, notes) {
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(`/projects/${id}/status`, {
        status,
        notes
    });
    return data.data;
}
async function getProjectStats() {
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/projects/stats");
    return data.data;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api/ussd-flows.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "configureProjectUssdFlow",
    ()=>configureProjectUssdFlow,
    "getProjectUssdFlow",
    ()=>getProjectUssdFlow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/client.ts [app-client] (ecmascript)");
;
async function getProjectUssdFlow(projectId) {
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(`/ussd-flows/projects/${projectId}`);
    return data.data;
}
async function configureProjectUssdFlow(projectId, input) {
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(`/ussd-flows/projects/${projectId}/initialize`, input);
    return data.data;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/format.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatChange",
    ()=>formatChange,
    "formatCount",
    ()=>formatCount,
    "formatMoney",
    ()=>formatMoney,
    "timeAgo",
    ()=>timeAgo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatDistanceToNow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/formatDistanceToNow.js [app-client] (ecmascript)");
;
const cedi = new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    currencyDisplay: "code"
});
function formatMoney(value) {
    return cedi.format(Number(value)).replace(/\u00a0/g, " ");
}
function formatCount(value) {
    return new Intl.NumberFormat("en-GH").format(value);
}
function timeAgo(iso, fallback = "Never") {
    return iso ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatDistanceToNow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDistanceToNow"])(new Date(iso), {
        addSuffix: true
    }) : fallback;
}
function formatChange(pct, suffix = "vs last month") {
    if (pct === null) return `No data ${suffix}`;
    return `${pct > 0 ? "+" : ""}${pct}% ${suffix}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);})()

//# sourceMappingURL=_209_it_nnssg-._.js.map