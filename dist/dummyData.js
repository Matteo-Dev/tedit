const data = [
    {
        type: "text",
        data: {
            text: "This is a headline",
            variant: 1,
        }
    },
    {
        type: "text",
        data: {
            text: "And this one is a very nice paragraph",
            variant: 0,
        }
    },
];
const types = [
    {
        name: "text",
        variants: [
            {
                "default": {},
                0: {
                    style: {
                        color: "#000000",
                        fontWeight: 500,
                        fontSize: "16px",
                    },
                    placeHolder: "Just a normal text field",
                    contentEditable: true,
                    className: "p",
                },
                1: {
                    style: {
                        fontWeight: "bold",
                        fontSize: "22px",
                    },
                    tagName: "h1",
                    placeHolder: "Header",
                    contentEditable: true,
                    className: "p",
                },
            }
        ]
    }
];
const init = {
    data: data,
    types: types,
};
export { init };
//# sourceMappingURL=dummyData.js.map