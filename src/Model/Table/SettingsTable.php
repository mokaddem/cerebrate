<?php
namespace App\Model\Table;

use App\Model\Table\AppTable;
use Cake\ORM\Table;
use Cake\Validation\Validator;
use Cake\Core\Configure;
use Cake\ORM\TableRegistry;

class SettingsTable extends AppTable
{
    public function initialize(array $config): void
    {
        parent::initialize($config);
        $this->setTable(false);
        $this->SettingsProvider = TableRegistry::getTableLocator()->get('SettingsProvider');
    }

    public function getSettings($full=false): array
    {
        $settings = Configure::read()['Cerebrate'];
        if (empty($full)) {
            return $settings;
        } else {
            $settingsProvider = $this->SettingsProvider->getSettingsConfiguration($settings);
            $settingsFlattened = $this->SettingsProvider->flattenSettingsConfiguration($settingsProvider);
            $notices = $this->SettingsProvider->getNoticesFromSettingsConfiguration($settingsProvider, $settings);
            return [
                'settings' => $settings,
                'settingsProvider' => $settingsProvider,
                'settingsFlattened' => $settingsFlattened,
                'notices' => $notices,
            ];
        }
    }

    public function getSetting($name=false): array
    {
        $settings = Configure::read()['Cerebrate'];
        $settingsProvider = $this->SettingsProvider->getSettingsConfiguration($settings);
        $settingsFlattened = $this->SettingsProvider->flattenSettingsConfiguration($settingsProvider);
        return $settingsFlattened[$name] ?? [];
    }

    public function saveSetting(string $name, string $value): array
    {
        $errors = [];
        // Save setting here!
        return $errors;
    }
}