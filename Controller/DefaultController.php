<?php

namespace MauticAddon\PowerFocusBundle\Controller;


use Mautic\CoreBundle\Controller\FormController;
use MauticAddon\PowerFocusBundle\Entity\PowerFocus;

class DefaultController extends FormController {

    /**
     * Generates the default view
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function indexAction() {

        $session = $this->factory->getSession();

        $search = $this->request->get('search', $session->get('mautic.power_focus.filter', ''));
        $session->set('mautic.power_focus.filter', $search);

        return $this->delegateView([
            'viewParameters'  => [
                'searchValue'      => $search,
                'security'         => $this->factory->getSecurity(),
            ],
            'contentTemplate' => 'PowerFocusBundle:Default:index.html.php',
            'passthroughVars' => [
                'activeLink'     => 'power_focus',
                'mauticContent'  => 'powerFocus',
                'route'          => $this->generateUrl('mautic_power_focus_index')
            ]
        ]);
    }

    /**
     * Generates new form and processes post data
     *
     * @param PowerFocus $powerFocus
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function newAction($powerFocus = null) {
        /** @var \MauticAddon\PowerFocusBundle\Model\PowerFocusModel $model */
        $model = $this->factory->getModel('addon.powerFocus.powerFocus');

        if (!($powerFocus instanceof PowerFocus)) {
            /** @var \MauticAddon\PowerFocusBundle\Entity\PowerFocus $entity */
            $powerFocus  = $model->getEntity();
        }

        $method  = $this->request->getMethod();
        $session = $this->factory->getSession();

        $action = $this->generateUrl('mautic_power_focus_action', ['objectAction' => 'new']);

        //create the form
        $form = $model->createForm($powerFocus, $this->get('form.factory'), $action);

        return $this->delegateView([
            'viewParameters'  =>  [
                'form'        => $this->setFormTheme($form, 'MauticAddonPowerFocusBundle:Default:form.html.php', 'MauticPowerFocusBundle:FormTheme\PowerFocus'),
                'tokens'      => $model->getBuilderComponents($powerFocus, 'tokenSections'),
                'activePage'  => $powerFocus
            ],
            'contentTemplate' => 'MauticAddonPowerFocusBundle:Default:form.html.php',
            'passthroughVars' => [
                'activeLink'    => '#mautic_power_focus_index',
                'mauticContent' => 'powerFocus',
                'route'         => $this->generateUrl('mautic_power_focus_action', [
                    'objectAction' => 'new'
                ])
            ]
        ]);

    }


}