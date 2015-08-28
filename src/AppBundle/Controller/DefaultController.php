<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Class DefaultController
 *
 * @package AppBundle\Controller
 */
class DefaultController extends Controller
{
    /**
     *
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/", name="homepage")
     */
    public function indexAction()
    {
        return $this->redirect('dashboard');
    }

    /**
     *
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/dashboard", name="dashboard")
     */
    public function dashboardAction()
    {
        $em = $this->getDoctrine()->getManager();
        $eventTypeCategories = array(
            'primary' => $em->getRepository('AppBundle:EventType')->findBy(
                array('isPrimary' => true),
                array('id' => 'ASC')
            ),
            'secondary' => $em->getRepository('AppBundle:EventType')->findBy(
                array('isPrimary' => false),
                array('id' => 'ASC')
            ),
        );

        $medicineTypes = $em->getRepository('AppBundle:Event')->findBy(
            array(
                'eventType' => $em->getRepository('AppBundle:EventType')->findBy(
                    array('name' => 'Medicine')
                ),
            )
        );

        $foodEventType = $em->getRepository('AppBundle:EventType')->findOneBy(array('name'=>'Food'));
        $foodTypes = $em->getRepository('AppBundle:Event')->findDistinctAndValueOfEventType($foodEventType);

        return $this->render('app/dashboard.html.twig', array(
            'eventTypeCategories' => $eventTypeCategories,
            'medicineTypes' => $medicineTypes,
            'foodTypes' => $foodTypes,
        ));
    }

    /**
     *
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @Route("/stats", name="stats")
     */
    public function statsAction()
    {
        return $this->render('app/stats.html.twig');
    }
}
