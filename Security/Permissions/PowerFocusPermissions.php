<?php

namespace MauticAddon\PowerFocusBundle\Security\Permissions;


use Mautic\CoreBundle\Security\Permissions\AbstractPermissions;
use Symfony\Component\Form\FormBuilderInterface;

class PowerFocusPermissions extends AbstractPermissions {

    /**
     * {@inheritdoc}
     */
    public function __construct($params) {
        parent::__construct($params);
        $this->addExtendedPermissions('pfocus');
    }

    /**
     * Returns the name of the permission set (should be the bundle identifier)
     *
     * @return string|void
     */
    public function getName() {
        return 'power_focus';
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface &$builder, array $options, array $data) {
        $this->addExtendedFormFields('power_focus', 'pfocus', $builder, $data);
    }

}