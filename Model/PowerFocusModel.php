<?php

namespace MauticAddon\PowerFocusBundle\Model;


use Mautic\CoreBundle\Model\FormModel;
use MauticAddon\PowerFocusBundle\Entity\PowerFocus;

class PowerFocusModel extends FormModel {

    public function getRepository() {
        /** @var \MauticAddon\PowerFocusBundle\Entity\PowerFocusRepository $repo */
        $repo = $this->em->getRepository('PowerFocusBundle:PowerFocus');
        $repo->setCurrentUser($this->factory->getUser());
        return $repo;
    }

    public function getPermissionBase() {
        return 'power_focus';
    }

    public function getNameGetter() {
        return 'getName';
    }

    /**
     * @param PowerFocus $powerFocus
     * @param bool|true $unlock
     */
    public function saveEntity(PowerFocus $powerFocus, $unlock = true) {

    }

    /**
     * @param PowerFocus $powerFocus
     * @param \Symfony\Component\Form\FormFactory $formFactory
     * @param null $action
     * @param array $options
     * @return \Symfony\Component\Form\Form
     */
    public function createForm(PowerFocus $powerFocus, $formFactory, $action = null, array $options = []) {

        if(!isset($options['formName'])) {
            $options['formName'] = 'form';
        }

        $params = (!empty($action)) ? ['action' => $action] : [];

        return $formFactory->create($options['formName'], $powerFocus, $params);
    }

    /**
     * @param null $id
     * @return PowerFocus
     */
    public function getEntity($id = null) {
        if(null === $id) {
            $powerFocus = new PowerFocus();
            $powerFocus->setSessionId('new_' . hash('sha1', uniqid(mt_rand())));
        } else {
            $powerFocus = parent::getEntity($id);
        }

        if(null !== $powerFocus) {
            $powerFocus->setSessionId($powerFocus->getId());
        }

        return $powerFocus;
    }

    public function generateUrl(PowerFocus $powerFocus, $absolute = true, array $clickThrough = []) {
    }

    public function generateSlug(PowerFocus $powerFocus) {

    }

}