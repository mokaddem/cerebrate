<?php
/*
 *  Toggle element - a simple checkbox with the current state selected
 *  On click, issues a GET to a given endpoint, retrieving a form with the
 *  value flipped, which is immediately POSTed.
 *  to fetch it.
 *
 */
    $data = $this->Hash->extract($row, $field['data_path']);
    $seed = rand();
    $checkboxId = 'GenericToggle-' . $seed;
    $tempboxId = 'TempBox-' . $seed;

    $requirementMet = true;
    if (isset($field['toggle_data']['requirement'])) {
        if (isset($field['toggle_data']['requirement']['options']['datapath'])) {
            foreach ($field['toggle_data']['requirement']['options']['datapath'] as $name => $path) {
                $field['toggle_data']['requirement']['options']['datapath'][$name] = empty($this->Hash->extract($row, $path)[0]) ? null : $this->Hash->extract($row, $path)[0];
            }
        }
        $options = isset($field['toggle_data']['requirement']['options']) ? $field['toggle_data']['requirement']['options'] : array();
        $requirementMet = $field['toggle_data']['requirement']['function']($row, $options);
    }

    echo sprintf(
        '<input type="checkbox" id="%s" %s %s><span id="%s" class="d-none"></span>',
        $checkboxId,
        empty($data[0]) ? '' : 'checked',
        $requirementMet ? '' : 'disabled="disabled"',
        $tempboxId
    );

    // inject title and body vars into their placeholder
    if (!empty($field['toggle_data']['confirm'])) {
        $availableType = ['title', 'titleHtml', 'body', 'bodyHtml'];
        foreach ($availableType as $varType) {
            if (!isset($field['toggle_data']['confirm'][$varType])) {
                continue;
            }
            $extractedVars = [];
            if (!empty($field['toggle_data']['confirm'][$varType . '_vars'])) {
                if (!is_array($field['toggle_data']['confirm'][$varType . '_vars'])) {
                    $extractedVars[] = $field['toggle_data']['confirm'][$varType . '_vars'];
                }
                foreach ($field['toggle_data']['confirm'][$varType . '_vars'] as $i => $path) {
                    $extractedVars[] = $this->Hash->get($row, $path);
                }
            }
            foreach ($extractedVars as $i => $value) {
                if (!empty($field['toggle_data']['confirm'][$varType])) {
                    $field['toggle_data']['confirm'][$varType] = str_replace(
                        '{{' . $i . '}}',
                        sprintf('<span class="font-weight-light">%s</span>', h($value)),
                        $field['toggle_data']['confirm'][$varType]
                    );
                }
            }
        }
    }
?>

<?php if ($requirementMet): ?>
<script type="text/javascript">
(function() {
    <?php
        $url = $field['url'];
        if (!empty($field['url_params_data_paths'][0])) {
            $url .= '/' . $this->Hash->get($row, $field['url_params_data_paths'][0]);
        }
    ?>
    const url = "<?= h($url) ?>"
    const confirmationOptions = <?= isset($field['toggle_data']['confirm']) ? json_encode($field['toggle_data']['confirm']) : 'false' ?>;
    $('#<?= $checkboxId ?>').click(function(evt) {
        evt.preventDefault()
        if(confirmationOptions !== false) {
            const modalOptions = {
                ...confirmationOptions,
                // confirm: () => { submitForm(url) },
                confirm: () => { console.log(url) },
            }
            UI.modal(modalOptions)
        } else {
            submitForm(url)
        }
    })

    function submitForm(url) {
        MISPApi.fetchAndPostForm(url)
            .then(data => {
                if (data.success) {
                    $('#<?= $checkboxId ?>').prop('checked', !$('#<?= $checkboxId ?>').prop('checked'));
                }
            })
    }
}())
</script>
<?php endif; ?>