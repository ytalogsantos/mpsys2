function InputFilter(obj: object): object {
    const filteredInput = {};
    let empty: boolean = true;

    for (const [key, value] of Object.entries(obj)) {
        if (value) {
            filteredInput[key as keyof Object] = value;
        }
    }
    
    return filteredInput;
}

export { InputFilter };