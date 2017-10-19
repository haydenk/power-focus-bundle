<?php

namespace MauticAddon\PowerFocusBundle\Controller;

use Mautic\CoreBundle\Controller\FormController;

class PowerFocusController extends FormController {

    public function indexAction ($page = 1) {
        return $this->delegateView([
            'viewParameters'  => [
                'message' => 'Hello!',
            ],
            'contentTemplate' => 'PowerFocusBundle:PowerFocus:default.html.php',
        ]);
    }

    public function goodbyeAction ($page = 1) {
        return $this->delegateView([
            'viewParameters'  => [
                'message' => 'Goodbye!',
            ],
            'contentTemplate' => 'PowerFocusBundle:PowerFocus:default.html.php',
        ]);
    }

}
