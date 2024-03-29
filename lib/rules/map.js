/**
 * @fileoverview rule-lodash-to-native-map
 * @author Aleksandr Bylkov
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "rule",
            category: "native",
            recommended: true
        },
        fixable: "code"
    },

    create: function(context) {

        let arrayWithVariables = [];
        const sourceCode = context.getSourceCode().text;

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const getLastParent = node => {
            const ancestors = context.getAncestors(node);

            return ancestors[ancestors.length - 1];
        }

        const isMap = node => {
            let lastParent = node.argument ? node.argument : '';

            if (node.type === "MemberExpression") {
                lastParent = getLastParent(node);
            }
            const nodeCallee = lastParent && lastParent.callee ? lastParent.callee : null;
            const nodeProperty = nodeCallee && nodeCallee.property ? nodeCallee.property : null;
            const nodeObject = nodeCallee && nodeCallee.object ? nodeCallee.object : null;
            const isParentMap = nodeProperty && nodeObject &&
                nodeProperty.name === "map" && nodeObject.name === "_";

            return isParentMap;
        }

        const isFirstArgumentArray = node => {
            if (node.arguments && node.arguments.length) {
                return node.arguments[0].type === "ArrayExpression"
            }
        }
        const isArgumentCondition = argument => argument && argument.type === "ConditionalExpression";

        const getArgumentsText = node => {
            if (node.arguments && node.arguments.length) {
                return node.arguments.map(element => {
                    if (element.start && element.end) {
                        return sourceCode.slice(element.start, element.end);
                    }
                });
            }
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            "VariableDeclarator": node => {
                if (node.init.type === "ArrayExpression") arrayWithVariables.push(node.id.name);
            },
            "MemberExpression": node => {
                if (isMap(node)) {
                    const lastParent = getLastParent(node);
                    const firstArgumentText = getArgumentsText(lastParent)[0];
                    const secondArgumentText = getArgumentsText(lastParent)[1];

                    if (isFirstArgumentArray(lastParent) || arrayWithVariables.includes(firstArgumentText)) {
                        const newMapText = `${firstArgumentText}.map(${secondArgumentText})`;

                        context.report({
                            node,
                            message: "Можно использовать нативный `Array#map`",
                            fix: fixer => fixer.replaceTextRange(lastParent.range, newMapText)
                        });
                    }
                }
            },
            "ReturnStatement": node => {
                if (isMap(node)) {
                    const firstArgumentText = getArgumentsText(node.argument)[0];
                    const secondArgumentText = getArgumentsText(node.argument)[1];
                    const isTwoArguments = firstArgumentText && secondArgumentText;
                    let newMapText = '';

                    if (isFirstArgumentArray(node.argument) && isTwoArguments) {

                        newMapText = `return ${firstArgumentText}.map(${secondArgumentText});`;

                    } else if (!isFirstArgumentArray(node.argument) && !isArgumentCondition(node) && isTwoArguments) {

                        newMapText = `return (Array.isArray(${firstArgumentText})) ? 
    ${firstArgumentText}.map(${secondArgumentText}) : 
    _.map(${firstArgumentText}, ${secondArgumentText});`;

                        if (arrayWithVariables.includes(firstArgumentText)) {
                            newMapText = `return ${firstArgumentText}.map(${secondArgumentText});`;
                        }
                    }

                    if (newMapText) {
                        context.report({
                            node,
                            message: "Можно использовать нативный `Array#map`",
                            fix: fixer => fixer.replaceTextRange(node.range, newMapText)
                        });
                    }
                }
            }
        }
    }
};