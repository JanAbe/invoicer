
export const validate = (node, regex, validColour='#2ecc71', invalidColour='#FF796C') => {
    node.addEventListener('keyup', () => {
        regex.test(node.value) 
            ? node.style.borderColor = validColour 
            : node.style.borderColor = invalidColour;
    });
}