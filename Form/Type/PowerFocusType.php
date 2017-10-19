<?php

namespace MauticAddon\PowerFocusBundle\Form\Type;


use Mautic\CoreBundle\Factory\MauticFactory;
use Symfony\Component\Form\AbstractType;

class PowerFocusType extends AbstractType {

    /**
     * @var \Symfony\Bundle\FrameworkBundle\Translation\Translator
     */
    private $translator;

    /**
     * @var bool|mixed
     */
    private $defaultTheme;

    /**
     * @var \Doctrine\ORM\EntityManager
     */
    private $em;

    /**
     * @var \Mautic\PageBundle\Model\PageModel
     */
    private $model;

    /**
     * @var \Mautic\UserBundle\Model\UserModel
     */
    private $user;

    /**
     * @var bool
     */
    private $canViewOther;

    /**
     * @param MauticFactory $factory
     */
    public function __construct(MauticFactory $factory) {
        $this->translator   = $factory->getTranslator();
        $this->em           = $factory->getEntityManager();
        $this->model        = $factory->getModel('addon.powerFocus.powerFocus');
        $this->canViewOther = true;
//        $this->canViewOther = $factory->getSecurity()->isGranted('page:pages:viewother');
        $this->user         = $factory->getUser();
    }

    /**
     * Returns the name of this type.
     *
     * @return string The name of this type
     */
    public function getName() {
        return 'power_focus';
    }

}