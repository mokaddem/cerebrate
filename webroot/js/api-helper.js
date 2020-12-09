class MISPAPI {
    static genericRequestHeaders = new Headers({
        'X-Requested-With': 'XMLHttpRequest'
    });
    static genericRequestConfigGET = {
        headers: MISPAPI.genericRequestHeaders
    }
    static genericRequestConfigPOST = {
        headers: MISPAPI.genericRequestHeaders,
        redirect: 'manual',
        method: 'POST',
    }

    static defaultOptions = {
        showToast: true
    }

    constructor(options) {
        this.options = Object.assign({}, MISPAPI.defaultOptions, options)
    }

    provideFeedback(options) {
        if (this.options.showToast) {
            UI.toast(options)
        } else {
            console.error(options.body)
        }
    }

    static mergeFormData(formData, dataToMerge) {
        for (const [fieldName, value] of Object.entries(dataToMerge)) {
            formData.set(fieldName, value)
        }
        return formData
    }

    async fetchForm(url) {
        try {
            const response = await fetch(url, MISPAPI.genericRequestConfigGET);
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const formHtml = await response.text();
            let tmpNode = document.createElement("div");
            tmpNode.innerHTML = formHtml;
            let form = tmpNode.getElementsByTagName('form');
            if (form.length == 0) {
                throw new Error('The server did not return a form element')
            }
            return form[0];
        } catch (error) {
            this.provideFeedback({
                variant: 'danger',
                title: 'There has been a problem with the operation',
                body: error
            });
            return Promise.reject(error);
        }
    }
    
    async fetchAndPostForm(url, dataToMerge={}) {
        try {
            const form = await this.fetchForm(url);
            try {
                let formData = new FormData(form)
                formData = MISPAPI.mergeFormData(formData, dataToMerge)
                let options = {
                    ...MISPAPI.genericRequestConfigPOST,
                    body: formData,
                };
                const response = await fetch(form.action, options);
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                const data = await response.json();
                this.provideFeedback({
                    variant: 'success',
                    title: data.message
                });
                return data;
            } catch (error) {
                this.provideFeedback({
                    variant: 'danger',
                    title: 'There has been a problem with the operation',
                    body: error
                });
                return Promise.reject(error);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

