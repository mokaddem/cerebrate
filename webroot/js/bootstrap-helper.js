
class UIFactory {
    toast(options) {
        const theToast = new Toaster(options);
        theToast.makeToast()
        theToast.show()
        return theToast
    }

    modal (options) {
        const theModal = new ModalFactory(options);
        theModal.makeModal()
        theModal.show()
        return theModal
    }
}

class Toaster {
    constructor(options) {
        this.options = Object.assign({}, Toaster.defaultOptions, options)
        this.bsToastOptions = {
            autohide: this.options.autohide,
            delay: this.options.delay,
        }
    }

    static defaultOptions = {
        id: false,
        title: false,
        muted: false,
        body: false,
        variant: 'default',
        autohide: true,
        delay: 5000,
        titleHtml: false,
        mutedHtml: false,
        bodyHtml: false,
        closeButton: true,
    }

    makeToast() {
        if (this.isValid()) {
            this.$toast = Toaster.buildToast(this.options)
            $('#mainToastContainer').append(this.$toast)
        }
    }

    show() {
        if (this.isValid()) {
            var that = this
            this.$toast.toast(this.bsToastOptions)
                .toast('show')
                .on('hidden.bs.toast', function () {
                    that.removeToast()
                })
        }
    }

    removeToast() {
        this.$toast.remove();
    }

    isValid() {
        return this.options.title !== false || this.options.muted !== false || this.options.body !== false || this.options.titleHtml !== false || this.options.mutedHtml !== false || this.options.bodyHtml !== false
    }

    static buildToast(options) {
        var $toast = $('<div class="toast" role="alert" aria-live="assertive" aria-atomic="true"/>')
        if (options.id !== false) {
            $toast.attr('id', options.id)
        }
        $toast.addClass('toast-' + options.variant)
        if (options.title !== false || options.titleHtml !== false || options.muted !== false || options.mutedHtml !== false) {
            var $toastHeader = $('<div class="toast-header"/>')
            $toastHeader.addClass('toast-' + options.variant)
            if (options.title !== false || options.titleHtml !== false) {
                var $toastHeaderText
                if (options.titleHtml !== false) {
                    $toastHeaderText = $('<div class="mr-auto"/>').html(options.titleHtml);
                } else {
                    $toastHeaderText = $('<strong class="mr-auto"/>').text(options.title)
                }
                $toastHeader.append($toastHeaderText)
            }
            if (options.muted !== false || options.mutedHtml !== false) {
                var $toastHeaderMuted
                if (options.mutedHtml !== false) {
                    $toastHeaderMuted = $('<div/>').html(options.mutedHtml)
                } else {
                    $toastHeaderMuted = $('<small class="text-muted"/>').text(options.muted)
                }
                $toastHeader.append($toastHeaderMuted)
            }
            if (options.closeButton) {
                var $closeButton = $('<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"><span aria-hidden="true">&times;</span></button>')
                $toastHeader.append($closeButton)
            }
            $toast.append($toastHeader)
        }
        if (options.body !== false || options.bodyHtml !== false) {
            var $toastBody
            if (options.bodyHtml !== false) {
                $toastBody = $('<div class="toast-body"/>').html(options.mutedHtml)
            } else {
                $toastBody = $('<div class="toast-body"/>').text(options.body)
            }
            $toast.append($toastBody)
        }
        return $toast
    }
}

class ModalFactory {
    constructor(options) {
        this.options = Object.assign({}, ModalFactory.defaultOptions, options)
        this.bsModalOptions = {
            show: true
        }
    }

    static defaultOptions = {
        id: false,
        size: 'md',
        centered: false,
        scrollable: false,
        title: '',
        titleHtml: false,
        body: '',
        bodyHtml: false,
        variant: '',
        modalClass: [],
        headerClass: [],
        bodyClass: [],
        footerClass: [],
        buttons: [],
        type: 'ok-only',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        confirm: () => {},
        cancel: () => {},
    }

    static availableType = [
        'ok-only',
        'confirm',
        'confirm-success',
        'confirm-warning',
        'confirm-danger',
    ]

    static closeButtonHtml = '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
    static spinnerHtml = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...'

    makeModal() {
        if (this.isValid()) {
            this.$modal = ModalFactory.buildModal(this.options)
            $('#mainModalContainer').append(this.$modal)
        }
    }

    show() {
        if (this.isValid()) {
            var that = this
            this.$modal.modal(this.bsModalOptions)
                .on('hidden.bs.modal', function () {
                    that.removeModal()
                })
        }
    }

    removeModal() {
        this.$modal.remove();
    }

    isValid() {
        return this.options.title !== false || this.options.body !== false || this.options.titleHtml !== false || this.options.bodyHtml !== false
    }

    static buildModal(options) {
        var $modal = $('<div class="modal fade" tabindex="-1" aria-hidden="true"/>')
        if (options.id !== false) {
            $modal.attr('id', options.id)
            $modal.attr('aria-labelledby', options.id)
        }
        if (options.modalClass !== false) {
            $modal.addClass(options.modalClass)
        }
        var $modalDialog = $('<div class="modal-dialog"/>')
        var $modalContent = $('<div class="modal-content"/>')
        if (options.title !== false || options.titleHtml !== false) {
            var $modalHeader = $('<div class="modal-header"/>')
            var $modalHeaderText
            if (options.titleHtml !== false) {
                $modalHeaderText = $('<div/>').html(options.titleHtml);
            } else {
                $modalHeaderText = $('<h5 class="modal-title"/>').text(options.title)
            }
            $modalHeader.append($modalHeaderText, ModalFactory.getCloseButton())
            $modalContent.append($modalHeader)
        }

        if (options.body !== false || options.bodyHtml !== false) {
            var $modalBody = $('<div class="modal-body"/>')
            var $modalBodyText
            if (options.bodyHtml !== false) {
                $modalBodyText = $('<div/>').html(options.bodyHtml);
            } else {
                $modalBodyText = $('<div/>').text(options.body)
            }
            $modalBody.append($modalBodyText)
            $modalContent.append($modalBody)
        }

        var $modalFooter = $('<div class="modal-footer"/>')
        $modalFooter.append(ModalFactory.getFooterBasedOnType(options))
        $modalContent.append($modalFooter)

        $modalDialog.append($modalContent)
        $modal.append($modalDialog)
        return $modal
    }

    static getFooterBasedOnType(options) {
        if (options.type == 'ok-only') {
            return ModalFactory.getFooterOkOnly(options.cancel)
        } else if (options.type.includes('confirm')) {
            return ModalFactory.getFooterConfirm(options.type.split('-')[1], options.confirmText, undefined, options.confirm, options.cancel)
        } else {
            return ModalFactory.getFooterOkOnly(options.cancel)
        }
    }

    static getFooterOkOnly(cancelCallback=() => {}) {
        return [
            $('<button type="button" class="btn btn-primary">OK</button>').click(cancelCallback)
        ]
    }

    static getFooterConfirm(variant='primary', confirmText='Confirm', cancelText='Cancel', confirmCallback=() => {}, cancelCallback=() => {}) {
        return [
            $('<button type="button" class="btn btn-secondary" data-dismiss="modal"></button>').text(cancelText).click(cancelCallback),
            $('<button type="button" class="btn"></button>').addClass('btn-' + variant).text(confirmText).click(confirmCallback)
        ]
    }

    static getCloseButton() {
        return $(ModalFactory.closeButtonHtml)
    }
}